/**
 *
 *  远程执行脚本，启动codeserver，进行WEB代理穿透
 *
 *  1. 检测是否安装了codeserver,如果安装了直接启动，如果没有安装，执行安装脚本
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
const remoteCodeServerPort = 8080;

const crypto = require('crypto');
const md5 = crypto.createHash('md5');

class CodeServerProxifier extends EventEmitter {
  constructor() {
    super();
    /**
     * key为ip-hash,value为CodeServerProxy，方便动态代理到目标机器
     * @see CodeServerProxy
     */
    this.codeServerPool = new Map();
    this.url = `localhost:${remoteCodeServerPort}`;
  }

  /**
   * 应该根据username+ip唯一确定一个连接
   */
  connect(connectOpts = null) {
    let id = md5.update(connectOpts.host).digest('hex');
    if (!this.codeServerPool.get(id)) {
      let codeServerProxy = new CodeServerProxy();
      codeServerProxy.build(connectOpts);
      this.codeServerPool.set(id, codeServerProxy);
    }
    return id;
  }

  getProxy(id) {
    return this.codeServerPool.get(id)?.agent;
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

module.exports = CodeServerProxy;

module.exports.commands = {
  // 如果安装了，返回/usr/bin/code-server，未安装会是/usr/bin/which: no code-server
  checkPackageInstall: 'which code-server', // 安装包，出现以下文本意味着安装完成
  // To have systemd start code-server now and restart on boot:
  //   sudo systemctl enable --now code-server@$USER
  // Or, if you don't want/need a background service you can run:
  //   code-server
  /**
   * 脚本参考 @see lib/code-server/code-server-install.sh
   */
  installPackage: 'curl -fsSL https://raw.githubusercontent.com/cdr/code-server/main/install.sh | sh',

  unInstallPackage: 'rm -rf ~/.local/share/code-server ~/.config/code-server',

  // 创建服务链接，且立即执行
  enableService: 'sudo systemctl enable --now code-server@$USER',

  // 启动服务，日志查看位置在~/.local/share/code-server/coder-logs
  startService: 'sudo systemctl start code-server@$USER',

  // 停止服务
  stopService: 'sudo systemctl stop code-server@$USER',

  checkService: 'sudo systemctl is-active code-server@$USER'
}

module.exports.codeServerProxifier = new CodeServerProxifier();
