const Client = require('ssh2/lib/client.js');
const {EventEmitter} = require('events');
const {randomString} = require('../../utils');
const net = require('net');
const timeout = 1000 * 60; // 1min

class SshTcpServer extends EventEmitter {

  constructor() {
    super();
    this.client = null;
    this.serverId = randomString(10);
    this.tcpServer = null;
    this.socketCount = 0;
  }

  connect(connectOpts, srcPort, srcIP, dstIP, dstPort) {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        console.log('connect ssh tcp server');
        this.client = new Client();
        this.client.on('ready', () => {
          let tcpServer = net.createServer((socket) => {
            ++this.socketCount;
            this.client.forwardOut(srcIP, srcPort, dstIP, dstPort, (err, sshSocket) => {
              if (err) {
                console.error(err);
                socket.close?.();
                return;
              }
              socket.pipe(sshSocket).pipe(socket);
            });
            socket.on('close', () => {
              --this.socketCount;
              this.afterSocketClose();
            });
          });
          tcpServer.listen(srcPort, srcIP, () => {
            const address = tcpServer.address();
            const port = address.port;
            this.tcpServer = tcpServer;
            this.srcPort = port;
            console.log('ssh tcp server listen on ' + srcIP + ':' + port);
            resolve();
          });
        }).connect(connectOpts);
      } else {
        console.log('use existed ssh tcp server');
        resolve();
      }
    });
  }

  forwardOut(cb) {
    const tcpClientSocket = net.connect(this.srcPort, this.srcIP, () => {
      cb(null, tcpClientSocket);
    });
  }

  afterSocketClose() {
    if (this.socketCount === 0) {
      if (this.timeoutTimer) {
        clearTimeout(this.timeoutTimer);
      }
      this.timeoutTimer = setTimeout(() => {
        if (this.socketCount === 0) {
          this.end();
        }
      }, timeout);
    }
  }

  end() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.tcpServer?.close();
    }
  }
}

module.exports = {
  SshTcpServer
}