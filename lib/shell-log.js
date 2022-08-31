const path = require('path')
const fs = require("fs");
const dayjs = require("dayjs");

class ShellLog {

  constructor(options = {}) {
    this.options = {
      timestamp: false, ...options
    };
  }

  start() {
    const fd = path.join(__dirname, '..', 'logs', 'ssh-log-record.log');
    if (fs.existsSync(fd)) {
      fs.unlinkSync(fd);
    }
    this.fsStream = fs.createWriteStream(fd, {
      flags: 'a', encoding: 'utf8'
    });
    this.write(`[BEGIN] ${formatDate(new Date())}\n`);
  }

  appendData(data) {
    let dataStr = data.toString();
    let res = this.removeAnsiColors(dataStr);
    res = eraseTerminalSequence(res);
    const context = this.extractFromAnsiSequences(dataStr);
    if (this.options.timestamp && context.timestamp) {
      res = `[${formatDate(new Date(context.timestamp * 1000))}] ${res}`;
    }
    this.write(res);
  }

  done(cb) {
    this.write(`\n\n[END] ${formatDate(new Date())}`);
    this.fsStream.end(cb);
  }

  extractFromAnsiSequences(data) {
    const context = {};
    const timestampArr = data.match(/(;Timestamp=)([^;\u0007]+)/); // 获取Timestamp
    if (timestampArr?.length >= 3) {
      context['timestamp'] = timestampArr[2];
    }
    return context;
  }

  write(res) {
    this.fsStream.write(res);
  }

  removeAnsiColors(data) {
    return data.replace(ansiRegex(), "");
  }
}


module.exports = ShellLog;


/**
 * @see https://github.com/chalk/ansi-regex
 * ANSI转义序列是带信号的标准编码,用于控制视频文本终端和终端模拟器上的光标位置、颜色、字体样式
 */
function ansiRegex({onlyFirst = false} = {}) {
  const pattern = ['[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)', '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'].join('|');
  return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

function formatDate(date) {
  return dayjs(date).format('YYYY/MM/DD HH:mm:ss');
}

/**
 * https://xtermjs.org/docs/api/vtfeatures/#bell
 * 终端行打印时需要根据控制符抹除部分字符显示，比如BS，删除前一个显示字符
 */
function eraseTerminalSequence(line) {
  // line = line.replace(/[\x00\x07\x0B\x0C\x0E\x0F\x1B]/g, '');
  line = line.replace(/[\x07]/g, '');
  let afterLine = line.replace(/(.\x08)/, '');
  while (afterLine !== line) {
    line = afterLine;
    afterLine = afterLine.replace(/(.\x08)/, '');
  }
  return afterLine;
}
