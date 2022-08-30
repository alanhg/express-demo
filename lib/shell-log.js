const path = require('path')
const fs = require("fs");

class ShellLog {

  constructor(options = {}) {
    this.options = {
      timestamp: false, ...options
    };
  }

  start() {
    this.fd = path.join(__dirname, '..', 'logs', 'ssh-log-record.log');
    if (fs.existsSync(this.fd)) {
      fs.unlinkSync(this.fd);
    }
    fs.writeFileSync(this.fd, `[BEGIN] ${new Date().toLocaleString()}\n`);
  }

  appendData(data) {
    let dataStr = data.toString();
    let res = this.removeAnsiColors(dataStr);
    const context = this.extractFromAnsiSequences(dataStr);
    if (this.options.timestamp && context.timestamp) {
      res = `[${new Date(context.timestamp * 1000).toLocaleString()}] ${res}`;
    }
    fs.appendFileSync(this.fd, res);
  }

  done() {
    fs.appendFileSync(this.fd, `\n[END] ${new Date().toLocaleString()}`);
  }

  extractFromAnsiSequences(data) {
    const context = {};
    const timestampArr = data.match(/(;Timestamp=)([^;\u0007]+)/); // 获取Timestamp
    if (timestampArr?.length >= 3) {
      context['timestamp'] = timestampArr[2];
    }
    return context;
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
  const pattern = ['[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)', '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'].join('|');

  return new RegExp(pattern, onlyFirst ? undefined : 'g');
}
