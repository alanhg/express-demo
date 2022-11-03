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


  /**
   * promise化命令执行，返回命令输出的完整结果
   * 如果需要是监控脚本之类的，直接走execCommand走事件监听即可。
   */
  execCommandPromisefy(command, encoding, trimNewline = true) {
    return new Promise(resolve => {
      let buf = [];
      this.on('command', (data) => {
        buf = buf.concat(data);
      })
      this.once('command:done', () => {
        if (encoding === 'utf8') {
          let s = buf.toString();
          if (trimNewline) {
            s = s.replace(/\n$/, '');
          }
          resolve(s);
          return;
        }
        resolve(buf);
      })
      this.execCommand(command);
    })
  }

  execCommand(command) {
    this.conn.exec(command, (err, stream) => {
      let buf = [];
      if (err) {
        return reject();
      }
      stream.on('close', () => {
        this.emit('command:done', buf);
      }).on('data', (data) => {
        buf = buf.concat(data);
        this.emit('command', data);
      }).stderr.on('data', (data) => {
        this.emit('command', data);
      });
    })
  }
}

module.exports = {SshClient};
