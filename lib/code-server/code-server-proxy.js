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
 *  2. codeserver安装定制化，解决codeserver功能，UI，安装目录，免密登录等定制化问题
 *  3. codeserver登录鉴权问题-免密登录
 *  4. 不同用户/不同机器-动态代理
 *
 *
 *
 *  https://code.visualstudio.com/docs/remote/vscode-server
 */
const net = require("net");
const {SshClient} = require("./ssh.js");

// 实际目标机器codeserver端口
const codeServerPort = 8080;
// 代理后暴露WEB端口
const proxyWebPort = 8001;

class CodeServerProxy extends SshClient {

  proxyCodeWeb() {
    return new Promise((resolve, reject) => {
      // TCP服务器
      net.createServer((sock) => {
        this.conn.forwardOut(sock.remoteAddress, sock.remotePort, '127.0.0.1', codeServerPort, function (err, stream) {
          if (err) {
            console.log(err);
            throw err;
          } // do something better than this

          sock.pipe(stream);
          stream.pipe(sock);
          // sock.resume() here if you paused earlier
        });
        resolve();
      }).listen(proxyWebPort).once('error', (err) => {
        // 重复绑定端口会报错
        console.error(err);
        resolve();
      });
    });
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

  // 创建服务链接，且立即执行
  enableService: 'sudo systemctl enable --now code-server@$USER',

  // 启动服务
  startService: 'sudo systemctl start code-server@$USER',

  // 停止服务
  stopService: 'sudo systemctl stop code-server@$USER',

  checkService: 'sudo systemctl is-active code-server@$USER'
}
