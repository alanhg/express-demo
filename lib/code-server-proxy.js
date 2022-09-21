const net = require("net");
const {SshClient} = require("./ssh.js");


class CodeServerProxy extends SshClient {

  proxyCodeWeb() {
    return new Promise(resolve => {
      net.createServer((sock) => {
        this.conn.forwardOut(sock.remoteAddress, sock.remotePort, '127.0.0.1', 8000, function (err, stream) {
          if (err) {
            console.log(err);
            throw err;
          } // do something better than this

          sock.pipe(stream);
          stream.pipe(sock);
          // sock.resume() here if you paused earlier
        });
        resolve();
      }).listen(8001);
    });
  }
}

module.exports = CodeServerProxy;
