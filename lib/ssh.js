const {Client} = require('ssh2');
const EventEmitter = require("events");

class SshClient extends EventEmitter {
  constructor() {
    super();
    this.conn = new Client();
  }

  connect(config) {
    this.config = config;
    this.conn.connect(config);
    this.conn.on('ready', () => {
      this.conn.shell({}, (err, s) => {
        if (err) {
          console.log('ssh shell error', err);
          throw err;
        }
        this.stream = s;
        s.on('close', () => {
          this.conn.end();
        }).on('data', (data) => {
          this.emit('data', data);
        });
      });
    });
    this.conn.on('close', (e) => {
      this.emit('close', e);
    });
  }

  execCommand(command) {
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) {
          this.conn.end();
          return reject();
        }
        stream.on('close', () => {
          resolve('');
        }).on('data', (data) => {
          resolve(data);
        });
      })
    })
  }

  write(data) {
    this.stream && this.stream.write(data);
  }
}

module.exports = SshClient;
