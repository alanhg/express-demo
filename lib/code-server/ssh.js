const {Client} = require('ssh2');
const {EventEmitter} = require("events");

class SshClient extends EventEmitter {
  constructor() {
    super();
    this.conn = new Client();
  }

  connect(connectOpts) {
    this.config = connectOpts;
    this.conn.connect(connectOpts);
    this.conn.on('ready', () => {
      this.emit('ready');
    });
    this.conn.on('close', (e) => {
      this.emit('close', e);
    });
    return this;
  }
}

module.exports = {SshClient};
