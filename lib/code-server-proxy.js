/**
 *
 *  远程执行脚本，启动codeserver
 *  1. 检测是否安装了codeserver,如果安装了直接启动，如果没有安装，执行安装脚本
 *     curl -fsSL https://raw.githubusercontent.com/cdr/code-server/main/install.sh | sh
 *     sudo systemctl enable --now code-server@$USER
 *     sudo systemctl start code-server@$USER
 *     sudo systemctl stop code-server@$USER
 *  2. codeserver安装定制化，解决codeserver功能，UI，安装目录，免密登录等定制化问题
 *
 *
 */
const net = require("net");
const {SshClient} = require("./ssh.js");

const codeServerPort = 8080;
const proxyWebPort = 8001;

class CodeServerProxy extends SshClient {

  proxyCodeWeb() {
    return new Promise((resolve, reject) => {
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
