const {Client} = require('ssh2');
const EventEmitter = require("events");
const stream = require("stream");

class SshProxyClient extends EventEmitter {
  constructor() {
    super();
    const conn = new Client();
    conn.on('ready', () => {
      conn.forwardOut('127.0.0.1', 12345, '127.0.0.1', 8000, (err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
          console.log('TCP :: CLOSED');
          conn.end();
        }).on('data', (data) => {
          console.log('TCP :: DATA: ' + data);
        });
      });
    });
    this.conn = conn;
  }

  connect(opts) {
    this.conn.connect(opts)
  }
}


module.exports = SshProxyClient;
