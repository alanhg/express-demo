const {EventEmitter} = require('events');
const httpProxy = require('http-proxy');
const pathMatch = require('path-match');
const {SSHTTPAgent} = require('./http-agent');
const route = pathMatch({
  // path-to-regexp options
  sensitive: false, strict: false, end: false,
});


// 实际目标机器codeserver端口,绑定端口可以在启动安装时定制
const remoteCodeServerPort = 36000;

const crypto = require('crypto');
const querystring = require('querystring');
const {Agent} = require('http');
const {CodeServerDB} = require('../../../db/model');


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


/**
 * SSH协议代理下需要缓存SSH连接信息，HTTP协议代理下因为外网IP访问，并不需要
 */
class CodeServerProxyManager extends EventEmitter {
  constructor(ip, port) {
    super();
    /**
     * key为proxyId,value为Proxy实体，方便动态代理到目标机器
     * @see Proxy
     */
    this.codeServerPool = new Map();
    this.ip = ip;
    this.port = port;
    this.url = `${ip}:${port}`;
  }

  /**
   * 应该根据username+host唯一确定一个连接
   * proxyProtocol: http|ssh
   */
  async createProxy(connectOpts, proxyProtocol = 'http') {
    try {
      const {host, username} = connectOpts;
      let proxyConfig = await CodeServerDB.findOne({
        where: {
          host,
          username,
          proxyProtocol
        }
      })
      if (!proxyConfig) {
        proxyConfig = await CodeServerDB.create({
          host,
          username,
          connectOpts,
          proxyProtocol,
          connections: 0
        })
      }
      const proxy = new Proxy(proxyConfig);
      this.codeServerPool.set(proxyConfig.id, proxy);
      return proxy;
    } catch (e) {
      console.error(e);
      return {}
    }
  }

  async getProxy(proxyKey) {
    let proxy = this.codeServerPool.get(proxyKey);
    if (proxy) {
      return proxy;
    } else {
      let proxyConfig = await CodeServerDB.findOne({
        where: {
          id: proxyKey,
        }
      });
      if (proxyConfig) {
        const proxy = new Proxy(proxyConfig);
        this.codeServerPool.set(proxyKey, proxy);
        return proxy;
      }
      return null;
    }
  }


}

class Proxy {

  constructor(proxyConfig) {
    this.config = proxyConfig;
    this.proxyKey = proxyConfig.id;
    this.proxyProtocol = proxyConfig.proxyProtocol;
    this.build(proxyConfig.connectOpts, proxyConfig.proxyProtocol);
  }

  /**
   * 正向代理
   */
  build(connectOpts = {}, proxyProtocol) {
    this.connectOpts = connectOpts;
    if (proxyProtocol === 'http') {
      this.agent = new Agent({keepAlive: true, timeout: 20000});
    } else {
      this.agent = new SSHTTPAgent({debug: console.log, ...connectOpts}, {
        keepAlive: false,
        timeout: 20000,
        // maxSockets: 5
      });
    }
    return this;
  }

  get url() {
    if (this.proxyProtocol === 'ssh') {
      return `http://127.0.0.1:${remoteCodeServerPort}`;
    }
    return `http://${this.connectOpts.host}:${remoteCodeServerPort}`;
  }

  get wsUrl() {
    if (this.proxyProtocol === 'ssh') {
      return `ws://127.0.0.1:${remoteCodeServerPort}`;
    }
    return `ws://${this.connectOpts.host}:${remoteCodeServerPort}`;
  }

  /**
   *
   */
  addActiveWebSocketConnections() {
    this.webSocketConnections = this.webSocketConnections + 1;
  }


  destroyActiveWebSocketConnections() {
    this.webSocketConnections = this.webSocketConnections - 1;
  }

  /**
   * 在代理连接数为0，即用户关闭了打开的所有Tab页时，关闭服务器端的code-server进程
   * @param afterEndCb
   */
  get activeConnections() {
    return this.webSocketConnections;
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
  deployCodeServer: [`if [ ! -e $HOME/.term/code-server-install-v1.0.sh ];then
mkdir -p $HOME/.term
curl -sSo $HOME/.term/code-server-install-v1.0.sh https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/code-server-install-v1.0.sh && sh $HOME/.term/code-server-install-v1.0.sh
else 
sh $HOME/.term/code-server-install-v1.0.sh
fi
`],

  // 停止服务
  get stopService() {
    return ['pkill -f ".term/code-server"'];
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
    return [...this.initEnv, `
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
    // await this.sshClient.execCommand(COMMANDS.renewPassword);
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
}

/**
 * 创建代理服务器，执行动态代理
 */
const proxyServer = httpProxy.createProxyServer({
  secure: false, ws: false, changeOrigin: false, hostRewrite: true,
  timeout: 20 * 1000,
  proxyTimeout: 20 * 1000,
});

proxyServer.on('start', (req) => delete req.headers.expect);

proxyServer.on('proxyReq', function (proxyReq, req, res, options) {
  const match = route(`/tty/:proxyKey`);
  const params = match(req.originalUrl);
  if (params?.proxyKey) {
    console.log({
      event: 'ide proxy server proxyReq', proxyKey: params.proxyKey, url: req.url
    });
  }

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

proxyServer.on('proxyRes', function (proxyRes, req, res) {
  const match = route(`/tty/:proxyKey`);
  const params = match(req.originalUrl);

  if (params?.proxyKey) {
    console.log({
      event: 'ide proxy server proxyRes',
      proxyKey: params.proxyKey,
      statusCode: proxyRes.statusCode,
      url: req.url
    });
  }
});

proxyServer.on('error', function (err, req, res) {
  const match = route(`/tty/:proxyKey`);
  const params = match(req.originalUrl);

  if (params?.proxyKey) {
    console.log({
      event: 'ide proxy server error', proxyKey: params.proxyKey
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
module.exports.route = route;
