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
    }, {});
    this.agent.on('end', () => {
    });
    return this;
  }


  addActiveConnections() {
    this.activeConnections = this.activeConnections + 1;
  }

  destroyActiveConnections() {
    this.activeConnections = this.activeConnections - 1;
    // if (this.activeConnections === 0) {
    //   const client = new SshClient();
    //   client.connect(this.connectOpts);
    //   client.on('ready', async () => {
    //     client.execCommandPromisefy(COMMANDS.stopService).then(() => {
    //       client.disconnect().on('close', () => {
    //         console.log(chalk.red('编辑器服务已关闭'));
    //       });
    //     });
    //     console.log(chalk.red('编辑器closed'));
    //   });
    // }
  }

  /**
   * Destroy any sockets that are currently in use by the agent.
   * this.agent.destroy
   */
  close() {

  }
}

/**
 * code server操作相关命令
 */
const COMMANDS = {
  /**
   * 脚本参考 @see lib/code-server/code-server-install.sh
   *
   * code-server安装配置有最低要求,1 GB of RAM, 2 CPU cores
   * @see https://coder.com/docs/code-server/latest/requirements
   */
  installPackage: 'curl -fsSL https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/code-server-install.sh | sh',

  /**
   * 删除服务及所有文件
   */
  uninstallService: 'sudo systemctl stop webshell-code-server && rm -f /usr/lib/systemd/system/webshell-code-server.service && rm -rf ~/.webshell/code-server',

  // 0表示已安装
  checkInstall: `if which ~/.webshell/code-server/.local/bin/code-server >/dev/null; then
    echo installed
else
    echo uninstalled
fi`,

  // 启动服务，日志查看位置在~/.local/share/code-server/coder-logs
  startService: 'sudo systemctl start webshell-code-server',

  // 停止服务
  stopService: 'sudo systemctl stop webshell-code-server',

  restartService: 'sudo systemctl restart webshell-code-server',

  checkService: 'sudo systemctl is-active webshell-code-server',

  // 返回结果:4.7.1 77bbed48315a7cc275dc05a53d197197928f4b88 with Code 1.71.2
  checkVersion: 'code-server --version'
};

const codeServerProxyManager = new CodeServerProxyManager();

/**
 * 走SSH方式检查/安装/启动code-server
 */
class CodeServerStarter {
  constructor(sshClient) {
    this.sshClient = sshClient;
  }

  /**
   * 返回proxyId，用于唯一识别代理
   * @returns {Promise<string>}
   */
  async start() {
    let installStatus = await this.sshClient.execCommandPromisefy(COMMANDS.checkInstall, 'utf8');
    let codeServerServiceStatus;
    // console.time('编辑器启动后，再次访问耗时记录');

    if (installStatus === 'uninstalled') {
      console.log(chalk.blue('code server未安装，即将自动安装'));

      await this.sshClient.execCommandPromisefy(COMMANDS.installPackage, 'utf8');
      console.log((chalk.blue('code server安装成功')));

      await this.sshClient.execCommandPromisefy(COMMANDS.startService);
      console.log(chalk.blue('code server服务启动成功'));
    }

    codeServerServiceStatus = await this.sshClient.execCommandPromisefy(COMMANDS.checkService, 'utf8');

    if (codeServerServiceStatus === 'unknown' || codeServerServiceStatus === 'inactive' || codeServerServiceStatus === 'failed') {
      console.log(chalk.blue('code server服务状态为', codeServerServiceStatus));

      // 执行启动
      await this.sshClient.execCommandPromisefy(COMMANDS.startService);
      codeServerServiceStatus = await this.sshClient.execCommandPromisefy(COMMANDS.checkService, 'utf8');
    }

    if (codeServerServiceStatus === 'active') {
      console.log(chalk.blue(`code server服务状态为${codeServerServiceStatus}，已启动，创建代理服务`));
      codeServerProxyManager.createProxy(this.sshClient.config);
      return 'success';
    }
    return 'failed'
  }

  static genProxyId(connectOpts) {
    return crypto.createHash('md5').update(connectOpts.host + connectOpts.username).digest('hex');
  }

}

module.exports.codeServerProxifier = codeServerProxyManager;
module.exports.CodeServerCheck = CodeServerStarter;
module.exports.CodeServerCommands = COMMANDS;
