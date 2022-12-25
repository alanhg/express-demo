const {SshClient} = require("./ssh.js");
const {EventEmitter} = require("events");
const httpProxy = require('http-proxy');
const pathMatch = require('path-match');
const route = pathMatch({
  // path-to-regexp options
  sensitive: false, strict: false, end: false,
});


// 实际目标机器codeserver端口,绑定端口可以在启动安装时定制
const remoteCodeServerPort = 36000;

const crypto = require('crypto');
const chalk = require("chalk");
const querystring = require("querystring");


function generatePassword() {
  const length = 24;
  const charset = '@#$&*0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&*0123456789abcdefghijklmnopqrstuvwxyz';
  let password = '';
  let i = 0;
  const n = charset.length;
  for (; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}


class CodeServerProxyManager extends EventEmitter {
  constructor(ip, port) {
    super();
    /**
     * key为proxyId,value为CodeServerProxy，方便动态代理到目标机器
     * @see Proxy
     */
    this.codeServerPool = new Map();
    this.ip = ip;
    this.port = port;
    this.url = `${ip}:${port}`;
  }

  buildProxyKey(connectOpts) {
    return crypto.createHash('md5')
      .update(connectOpts.host + connectOpts.username).digest('hex');
  }

  /**
   * 应该根据username+host唯一确定一个连接
   */
  createProxy(connectOpts = null) {
    const proxyKey = crypto.createHash('md5')
      .update(connectOpts.host + connectOpts.username).digest('hex');
    if (!this.codeServerPool.get(proxyKey)) {
      let codeServerProxy = new Proxy();
      codeServerProxy.build(connectOpts);
      this.codeServerPool.set(proxyKey, codeServerProxy);
    }
    return proxyKey;
  }

  getProxy(proxyKey) {
    return this.codeServerPool.get(proxyKey);
  }
}

class Proxy extends SshClient {

  constructor() {
    super();
    this.connectOpts = null;
    this.webSocketConnections = 0; // Code-ServerWS连接数，目前看来没打开一个编辑器会创建2条连接
  }

  get url() {
    return `http://${this.connectOpts.host}:${remoteCodeServerPort}`;
  }

  get wsUrl() {
    return `ws://${this.connectOpts.host}:${remoteCodeServerPort}`;
  }

  /**
   *
   */
  addActiveWebSocketConnections() {
    this.webSocketConnections = this.webSocketConnections + 1;
    console.log('this.webSocketConnections', this.webSocketConnections);
  }


  destroyActiveWebSocketConnections() {
    this.webSocketConnections = this.webSocketConnections - 1;
    console.log('this.webSocketConnections', this.webSocketConnections);
  }

  /**
   * 在代理连接数为0，即用户关闭了打开的所有Tab页时，关闭服务器端的code-server进程
   * @param afterEndCb
   */
  get activeConnections() {
    return this.webSocketConnections;
  }

  build(connectOpts) {
    this.connectOpts = connectOpts;
    return this;
  }

  destroyActiveConnections() {
    this.activeConnections = this.activeConnections - 1;
    console.log('activeConnections', this.activeConnections)
    // if (this.activeConnections === 0) {
    //   const client = new SshClient();
    //   client.connect(this.connectOpts);
    //   client.on('ready', async () => {
    //     client.execCommandStream(COMMANDS.stopService);
    //     client.on('command:done', () => {
    //       client.disconnect();
    //       console.log(chalk.red('编辑器closed'));
    //     });
    //   });
    // }
  }
}

/**
 * code server操作相关命令
 */
const COMMANDS = {
  initEnv: ['export CODE_SERVER_PORT=36000', 'export CODE_SERVER_DIR=$HOME/.term/code-server', 'export CODE_SERVER_RUN_DIR=$HOME/.term/code-server-run', 'export BIND_ADDR=127.0.0.1:$CODE_SERVER_PORT', 'export USER_DATA_PATH=$CODE_SERVER_DIR/share', 'export CONFIG_PATH=$CODE_SERVER_DIR/.config/config.yaml', 'export EXTENSION_PATH=$CODE_SERVER_DIR/share/extensions', 'PATH="$CODE_SERVER_DIR/bin:$PATH"',],
  /**
   * 脚本参考 @see lib/code-server/code-server-install-v1.0.sh
   *
   * code-server安装配置有最低要求,1 GB of RAM, 2 CPU cores
   * @see https://coder.com/docs/code-server/latest/requirements
   */
  deployCodeServer: [`if [ ! -e $HOME/.term/code-server-run/code-server-install-v1.0.sh ];then
mkdir -p $HOME/.term/code-server-run  
curl -sSo $HOME/.term/code-server-run/code-server-install-v1.0.sh https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/code-server-install-v1.0.sh && sh $HOME/.term/code-server-run/code-server-install-v1.0.sh
else 
sh $HOME/.term/code-server-run/code-server-install-v1.0.sh
fi
`],

  // 停止服务
  get stopService() {
    return [...this.initEnv, '$CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl stop all'];
  },

  /**
   * 获取code-server初始化配置，用于自动密码填充
   * @returns {string[]}
   */
  get codeServerConfig() {
    return [...this.initEnv, 'cat $CODE_SERVER_DIR/.config/config.yaml'];
  },

  /**
   * 如果程序还未启动则更新密码,
   * @returns {string[]}
   */
  get renewPassword() {
    return [...this.initEnv,
      `
      renew_password() {
    if [ -e $CODE_SERVER_DIR/.config/config.yaml ];then
      cat <<EOF >  $CODE_SERVER_DIR/.config/config.yaml
bind-addr: 127.0.0.1:8080
auth: password
password: "${generatePassword()}"
cert: false
EOF
    fi
      }
      
client_status=$($CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl status code-server)
client_status=$(echo "$client_status" | tr '[:upper:]' '[:lower:]')

if [ "$client_status" = "" ]; then
 renew_password
 fi
    `];
  }, // 返回结果:4.7.1 77bbed48315a7cc275dc05a53d197197928f4b88 with Code 1.71.2
  checkVersion: 'code-server --version'
};
const REMOTE_CODE_SERVER_PORT = 36000;
const REMOTE_CODE_SERVER_IP = '127.0.0.1';
const codeServerProxyManager = new CodeServerProxyManager(REMOTE_CODE_SERVER_IP, REMOTE_CODE_SERVER_PORT);

/**
 * 走SSH方式检查/安装/启动code-server
 */
class CodeServerStarter extends EventEmitter {
  constructor(sshClient) {
    super();
    this.sshClient = sshClient;
  }

  /**
   * 返回proxyId，用于唯一识别代理
   * @returns {Promise<string>}
   */
  async start() {
    await this.sshClient.execCommand(COMMANDS.renewPassword);
    this.sshClient.execCommandStream(COMMANDS.deployCodeServer);
    const sendProgress = buf => {
      this.emit('start-progress', buf.toString());
    };
    this.sshClient.on('command', sendProgress);
    this.sshClient.once('command:done', () => {
      this.emit('start-result');
      this.sshClient.removeListener('command', sendProgress);
    });
  }

  getPassword() {
    return new Promise((resolve, reject) => {
      this.sshClient.execCommandStream(COMMANDS.codeServerConfig);
      this.sshClient.once('command:done', buf => {
        if (buf.toString()) {
          const password = buf.toString().match(/(?<=password: ).+/)[0].replace(/^"|"$/g, '');
          console.log('password is ' + password);
          resolve(password);
        } else {
          reject();
        }
      });
    })
  }

  static genProxyId(connectOpts) {
    return crypto.createHash('md5').update(connectOpts.host + connectOpts.username).digest('hex');
  }

}

/**
 * 创建代理服务器，执行动态代理
 */
const proxyServer = httpProxy.createProxyServer({
  secure: false, ws: false, changeOrigin: false, hostRewrite: true
});

proxyServer.on('proxyReq', function (proxyReq, req, res, options) {
  if (!req.body || !Object.keys(req.body).length) {
    return;
  }

  const contentType = proxyReq.getHeader('Content-Type');
  const writeBody = (bodyData) => {
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  };

  if (contentType.toString().includes('application/json')) {
    writeBody(JSON.stringify(req.body));
  }

  if (contentType.toString().includes('application/x-www-form-urlencoded')) {
    writeBody(querystring.stringify(req.body));
  }
});

proxyServer.on('proxyReq', function (proxyReq, req, res, options) {
  const match = route(`/tty/:proxyKey`);
  const params = match(req.originalUrl);
GIT 
  if (params?.proxyKey) {
    console.log({
      event: 'ide proxy server proxyReq', proxyKey: params.proxyKey, url: req.url
    });
  }
});


proxyServer.on('error', function (err, req, res) {
  const match = route(`/tty/:proxyKey`);
  const params = match(req.originalUrl);

  if (params?.proxyKey) {
    console.log({
      event: 'ide proxy server error',
      proxyKey: params.proxyKey
    });
  }

  if (err.code === 'ECONNRESET') {
    res.writeHead(500, {
      'Content-Type': 'text/plain;charset=utf-8'
    });
    res.end(`error:Port 36000 is not open or code-server start failed`);
  }
});

proxyServer.on('close', function (res, socket, head) {
  console.log(res);
});

module.exports.codeServerProxyManager = codeServerProxyManager;
module.exports.CodeServerCheck = CodeServerStarter;
module.exports.CodeServerCommands = COMMANDS;
module.exports.codeServerProxy = proxyServer;
