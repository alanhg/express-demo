const Client = require('ssh2-sftp-client');
const path = require('path');
const EventEmitter = require("events");

class SshFtpClient extends EventEmitter {

  constructor() {
    super();
    this.conn = new Client();
  }

  connect(config) {
    this.config = config;
    return this.conn.connect(config).catch(err => {
      console.log(`Error: ${err.message}`); // error message will include 'example-client'
    }).then(() => {
      this.emit('connected');
    });
  }

  list(path) {
    return this.conn.list(path);
  }

  get(path, dst) {
    return this.conn.get(path, dst);
  }

  put(dst, path) {
    return this.conn.put(dst, path);
  }
}

module.exports = SshFtpClient
