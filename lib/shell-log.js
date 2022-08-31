const path = require('path')
const fs = require("fs");
const dayjs = require("dayjs");
const readline = require('readline');

class ShellLog {

  constructor(options = {}) {
    this.options = {
      timestamp: false, ...options
    };
  }

  start() {
    this.fd = path.join(__dirname, '..', 'logs', 'ssh-log-record_source.log');
    if (fs.existsSync(this.fd)) {
      fs.unlinkSync(this.fd);
    }
    this.fsStream = fs.createWriteStream(this.fd, {
      flags: 'a', encoding: 'utf8'
    });

    this.fdPlainText = path.join(__dirname, '..', 'logs', 'ssh-log-record_plaintext.log');
    if (fs.existsSync(this.fdPlainText)) {
      fs.unlinkSync(this.fdPlainText);
    }
    this.fdPlainTextStream = fs.createWriteStream(this.fdPlainText, {
      flags: 'a', encoding: 'utf8'
    });

    this.write(`[BEGIN] ${formatDate(new Date())}\n`);
  }

  appendData(data) {
    let dataStr = data.toString();
    this.write(dataStr);
  }

  /**
   * 在结束时针对日志文件按行进行处理
   */
  done(cb) {
    this.write(`\n\n[END] ${formatDate(new Date())}`);

    new Promise(resolve => this.fsStream.end(resolve))
      .then(() => {
        const rl = readline.createInterface({
          input: fs.createReadStream(this.fd),
        });
        rl.on('line', (line) => {
          const context = this.extractFromAnsiSequences(line);
          if (this.options.timestamp && context.timestamp) {
            line = `[${formatDate(new Date(context.timestamp * 1000))}] ${line}`;
          }
          line = this.removeAnsiColors(line);
          line = eraseTerminalSequence(line);
          this.fdPlainTextStream.write(line + '\n');
        });
        rl.on('close', () => {
          this.fdPlainTextStream.end(cb);
        })
      });
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
  let left = line.replace(/[\x07]/g, '');
  let right = left.replace(/(.\x08)/, '');
  while (left !== right) {
    left = right;
    right = left.replace(/(.\x08)/, '');
  }
  return right;
}
