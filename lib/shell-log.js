const path = require('path')
const fs = require("fs");

class ShellLog {

  constructor() {
  }

  start() {
    this.fd = path.join(__dirname, '..', 'logs', 'ssh-log-record.log');
    if (fs.existsSync(this.fd)) {
      fs.unlinkSync(this.fd);
    }
    fs.writeFileSync(this.fd, `[BEGIN] ${new Date().toLocaleString()}\n`);
  }

  appendData(data) {
    fs.appendFileSync(this.fd, this.removeAnsiColors(data.toString()));
  }

  done() {
    fs.appendFileSync(this.fd, `\n[END] ${new Date().toLocaleString()}`);
  }


  removeAnsiColors(data) {
    return data.replace(/\033\[[0-9;]*m/g, "");
  }
}


module.exports = ShellLog;
