const path = require('path')
const fs = require("fs");

class ShellLog {

  constructor() {
  }

  start() {
    this.fd = path.join(__dirname, '..', 'logs', 'ssh-log-record.log');
  }

  appendData(data) {
    if (!fs.existsSync(this.fd)) {
      fs.writeFileSync(this.fd, `[BEGIN] ${new Date().toLocaleString()}\n`);
    } else {
      fs.appendFileSync(this.fd, data);
    }
  }

  done() {
    fs.appendFileSync(this.fd, `\n[END] ${new Date().toLocaleString()}`);
  }
}


module.exports = ShellLog;
