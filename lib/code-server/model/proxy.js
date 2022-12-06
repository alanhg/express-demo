const {SshClient} = require("./ssh.js");
const {EventEmitter} = require("events");
const {SSHTTPAgent: HTTPAgent} = require("./ssh-agent");

// 实际目标机器codeserver端口,绑定端口可以在启动安装时定制
const remoteCodeServerPort = 36000;

const crypto = require('crypto');
const chalk = require("chalk");

class CodeServerProxyManager extends EventEmitter {
  constructor() {
    super();
    /**
     * key为proxyId,value为CodeServerProxy，方便动态代理到目标机器
     * @see Proxy
     */
    this.codeServerPool = new Map();
    this.url = `localhost:${remoteCodeServerPort}`;
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
    this.agent = null;
    this.activeConnections = 0; // 打开的Tab页数
  }

  /**
   * 正向代理
   */
  build(connectOpts) {
    this.connectOpts = connectOpts;
    this.agent = new HTTPAgent({
      keepaliveInterval: 30000, // 心跳间隔，毫秒
      keepaliveCountMax: 200, // 心跳次数，毫秒
      readyTimeout: 20000, ...this.connectOpts
    }, {
      keepAlive: true, keepAliveMsecs: 30000, maxSockets: 2, timeout: 20000,
    });
    return this;
  }


  addActiveConnections() {
    this.activeConnections = this.activeConnections + 1;
    console.log('activeConnections', this.activeConnections);
  }

  destroyActiveConnections() {
    this.activeConnections = this.activeConnections - 1;
    console.log('activeConnections', this.activeConnections)
    if (this.activeConnections === 0) {
      const client = new SshClient();
      client.connect(this.connectOpts);
      client.on('ready', async () => {
        client.execCommand(COMMANDS.stopService);
        client.on('command:done', () => {
          client.disconnect();
          this.agent.destroy();
          console.log(chalk.red('编辑器closed'));
        });
      });
    }
  }
}

/**
 * code server操作相关命令
 */
const COMMANDS = {
  initEnv: ['export CODE_SERVER_PORT=36000',
    'export CODE_SERVER_DIR=$HOME/.term/code-server',
    'export CODE_SERVER_RUN_DIR=$HOME/.term/code-server-run',
    'export BIND_ADDR=127.0.0.1:$CODE_SERVER_PORT', 'export USER_DATA_PATH=$CODE_SERVER_DIR/share', 'export CONFIG_PATH=$CODE_SERVER_DIR/.config/config.yaml', 'export EXTENSION_PATH=$CODE_SERVER_DIR/share/extensions', 'PATH="$CODE_SERVER_DIR/bin:$PATH"',],
  /**
   * 脚本参考 @see lib/code-server/code-server-install-v1.0.sh
   *
   * code-server安装配置有最低要求,1 GB of RAM, 2 CPU cores
   * @see https://coder.com/docs/code-server/latest/requirements
   */
  deployPackage: [
    `if [ ! -e $HOME/.term/code-server/code-server-install-v1.0.sh ];then
mkdir -p $HOME/.term/code-server  
curl -sSo $HOME/.term/code-server/code-server-install-v1.0.sh https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/code-server-install-v1.0.sh
fi
sh $HOME/.term/code-server/code-server-install-v1.0.sh
`
  ],

  // 停止服务
  get stopService() {
    return [...this.initEnv, '$CODE_SERVER_RUN_DIR/supervisord-conf/bin/supervisord -c $CODE_SERVER_RUN_DIR/supervisord-conf/supervisord.conf ctl stop code-server'];
  },

  // 返回结果:4.7.1 77bbed48315a7cc275dc05a53d197197928f4b88 with Code 1.71.2
  checkVersion: 'code-server --version'
};

const codeServerProxyManager = new CodeServerProxyManager();

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
  start() {
    this.sshClient.execCommand(COMMANDS.deployPackage);
    this.sshClient.on('command', buf => {
      this.emit('start-progress', buf.toString());
    });
    this.sshClient.on('command:done', () => {
      this.emit('start-result');
    });
  }

  static genProxyId(connectOpts) {
    return crypto.createHash('md5').update(connectOpts.host + connectOpts.username).digest('hex');
  }

}

module.exports.codeServerProxifier = codeServerProxyManager;
module.exports.CodeServerCheck = CodeServerStarter;
module.exports.CodeServerCommands = COMMANDS;
