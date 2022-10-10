/**
 *
 *  远程执行脚本，启动codeserver，进行WEB代理穿透
 *
 *  1. 检测是否安装了codeserver,如果安装了直接启动，如果没有安装，执行安装脚本
 *     安装说明 @see https://coder.com/docs/code-server/latest/install#installsh
 *     which code-server
 *     curl -fsSL https://raw.githubusercontent.com/cdr/code-server/main/install.sh | sh
 *
 *     sudo systemctl enable --now code-server@$USER
 *     sudo systemctl start code-server@$USER
 *     sudo systemctl stop code-server@$USER
 *     默认启动后密码登录 cat ~/.config/code-server/config.yaml
 *
 *     禁用密码登录方式如下，需要重启服务
 *     sed -i.bak 's/auth: password/auth: none/' ~/.config/code-server/config.yaml
 *
 *     针对断开的SSH forward代理，可以检测
 *     ~/.ssh/config
 *     Host *
 *     ServerAliveInterval 5
 *     ExitOnForwardFailure yes
 *  2. codeserver安装定制化，解决codeserver功能，UI，安装目录，免密登录等定制化问题
 *  3. codeserver登录鉴权问题-免密登录
 *  4. 不同用户/不同机器-动态代理
 *
 *
 *
 *  https://code.visualstudio.com/docs/remote/vscode-server
 *
 *
 *  云厂商部署code-server脚本如下
 *  https://github.com/coder/deploy-code-server/blob/main/deploy-vm/launch-code-server.sh
 *
 *  常见问题
 *  https://coder.com/docs/code-server/latest/FAQ
 *
 *
 *
 *  # 进一步的优化，针对前端静态资源，可以处理从而走CDN进行提速
 *
 */
const {SshClient} = require("./ssh.js");
const {EventEmitter} = require("events");
const {HTTPAgent} = require("ssh2");

// 实际目标机器codeserver端口,绑定端口可以在启动安装时定制
const remoteCodeServerPort = 8090;

const crypto = require('crypto');

class CodeServerProxyManager extends EventEmitter {
  constructor() {
    super();
    /**
     * key为proxyId,value为CodeServerProxy，方便动态代理到目标机器
     * @see CodeServerProxy
     */
    this.codeServerPool = new Map();
    this.url = `localhost:${remoteCodeServerPort}`;
  }

  /**
   * 应该根据username+ip唯一确定一个连接
   */
  connect(connectOpts = null) {
    const proxyKey = crypto.createHash('md5').update(connectOpts.host + connectOpts.username).digest('hex');
    if (!this.codeServerPool.get(proxyKey)) {
      let codeServerProxy = new CodeServerProxy();
      codeServerProxy.build(connectOpts);
      this.codeServerPool.set(proxyKey, codeServerProxy);
    }
    return proxyKey;
  }

  getProxy(proxyKey) {
    return this.codeServerPool.get(proxyKey)?.agent;
  }
}

class CodeServerProxy extends SshClient {

  constructor() {
    super();
    this.connectOpts = null;
    this.agent = null;
  }

  /**
   * 正向代理
   */
  build(connectOpts) {
    this.connectOpts = connectOpts;
    this.agent = new HTTPAgent({
      keepaliveInterval: 1000, keepaliveCountMax: 1, ...this.connectOpts
    })
    return this;
  }

  close() {

  }
}

/**
 * code server操作相关命令
 */
const COMMANDS = {
  // To have systemd start code-server now and restart on boot:
  //   sudo systemctl enable --now code-server@$USER
  // Or, if you don't want/need a background service you can run:
  //   code-server
  /**
   * 脚本参考 @see lib/code-server/code-server-install.sh
   *
   * code-server安装配置有最低要求,1 GB of RAM, 2 CPU cores
   * @see https://coder.com/docs/code-server/latest/requirements
   */
  installPackage: 'curl -fsSL https://gist.githubusercontent.com/alanhg/2416d0752c60ee7fd9130e3e8ea7d4d3/raw/8e6e18296fc88533393f397100d3c10940f79768/code-server-install.sh | sh',

  unInstallPackage: 'rm -rf ~/.local/share/code-server ~/.config/code-server',

  // 启动服务，日志查看位置在~/.local/share/code-server/coder-logs
  startService: 'sudo systemctl start code-server@$USER',

  // 停止服务
  stopService: 'sudo systemctl stop code-server@$USER',

  restartService: 'sudo systemctl restart code-server@$USER',

  checkService: 'sudo systemctl is-active code-server@$USER',

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
    let codeServerServiceStatus = await this.sshClient.execCommandPromisefy(COMMANDS.checkService, 'utf8');

    if (codeServerServiceStatus === 'unknown') {
      console.log('code server未安装，即将自动安装'.info);

      await this.sshClient.execCommandPromisefy(COMMANDS.installPackage, 'utf8');
      console.log('code server安装成功'.info);

      await this.sshClient.execCommandPromisefy(COMMANDS.startService);
      console.log('code server服务启动成功'.info);

      codeServerServiceStatus = await this.sshClient.execCommandPromisefy(COMMANDS.checkService, 'utf8');
    }

    if (codeServerServiceStatus === 'inactive' || codeServerServiceStatus === 'failed') {
      // 执行启动
      await this.sshClient.execCommandPromisefy(COMMANDS.startService);
      console.log(`code server服务状态为${codeServerServiceStatus}，启动成功`.info);

      codeServerServiceStatus = await this.sshClient.execCommandPromisefy(COMMANDS.checkService, 'utf8');
    }

    if (codeServerServiceStatus.match(/^active/)) {
      console.log('code server服务已启动，开启代理服务'.info);
      return codeServerProxyManager.connect(this.sshClient.config);
    }
  }
}

module.exports.codeServerProxifier = codeServerProxyManager;
module.exports.CodeServerCheck = CodeServerStarter;
