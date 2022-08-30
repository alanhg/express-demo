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
    return data.replace(ansiRegex(), "");
  }
}


module.exports = ShellLog;


/**
 * @see https://github.com/chalk/ansi-regex
 */
function ansiRegex({onlyFirst = false} = {}) {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
  ].join('|');

  return new RegExp(pattern, onlyFirst ? undefined : 'g');
}
