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


  disconnect() {
    this.conn.end();
    return this;
  }


  execCommand(command) {
    if (Array.isArray(command)) {
      command = command.join('&&');
    }
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        let buf = [];
        if (err) {
          reject(err);
          return;
        }

        stream.on('data', (data) => {
          buf = buf.concat(data);
        }).on('close', () => {
          resolve(buf);
        }).stderr.on('data', (data) => {
          console.log(data);
          stream.close();
        });
      });
    });
  }

  execCommandStream(command) {
    if (Array.isArray(command)) {
      command = command.join('&&');
    }
    this.conn.exec(command, (err, stream) => {
      let buf = [];
      if (err) {
        return;
      }
      stream.on('close', () => {
        this.emit('command:done', buf);
      }).on('data', (data) => {
        buf = buf.concat(data);
        this.emit('command', data);
      }).stderr.on('data', (data) => {
        this.emit('command', data);
        stream.close();
      });
    })
  }
}

module.exports = {SshClient};
