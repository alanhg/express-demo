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
      this.conn.shell((err, s) => {
        if (err) throw err;
        this.stream = s;
        this.stream.on('close', () => {
          console.log('Stream :: close');
          // this.conn.end();
        }).on('data', (data) => {
          this.emit('data', data);
        });
      });
    });
  }

  execCommand(command) {
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) {
          console.log('SECOND :: exec error: ' + err);
          this.conn.end();
          return reject();
        }
        stream.on('close', () => {
          this.conn.end(); // close parent (and this) connection
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
