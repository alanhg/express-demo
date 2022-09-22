const net = require("net");
const {SshClient} = require("./ssh.js");

const codeServerPort = 8080;

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
      }).listen(8001).once('error', (err) => {
        // 重复绑定端口会报错
        console.error(err);
        resolve();
      });
    });
  }
}

module.exports = CodeServerProxy;
