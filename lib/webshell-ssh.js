const {Client} = require("ssh2");
const {SshClient} = require("./code-server/ssh");
const {CodeServerCheck} = require("./code-server/code-server-proxy");
const colors = require('colors');
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

class SshShellClient extends SshClient {
  constructor(ws) {
    super(new Client());
    this.ws = ws;
  }

  connect(connectOpts) {
    this.config = connectOpts;
    this.conn.connect(connectOpts);
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
          this.ws.send(data);
        });
      });
      this.emit('ready');
    });
    this.conn.on('close', (e) => {
      this.emit('close', e);
    });

    this.ws.on('message', async (msg) => {
      const options = JSON.parse(msg);
      if (options.type === 'search') {
        let command = `ug -r '${options.data}' -n -k -I ${options.path} --ignore-files`;
        /**
         * @see https://www.runoob.com/linux/linux-comm-grep.html
         * -a 或 --text : 不要忽略二进制的数据。
         * -i 或 --ignore-case : 忽略字符大小写的差别。
         *
         */
        console.log(command);
        this.execCommand(command).then(res => {
          this.ws.send(JSON.stringify({
            type: 'search', path: options.path, keyword: options.data, data: res
          }));
        })
      }

      if (options.type === 'codeserver') {
        const coderServerCheck = new CodeServerCheck(this);
        const id = await coderServerCheck.start();
        if (id) {
          this.send('codeserver', {
            message: 'run ok', id
          });
        } else {
          this.send('codeserver', {
            message: 'run ok', id
          });
        }
      } else {
        this.write(options.data);
      }
    });
  }

  execCommand(command, encode = 'utf8') {
    this.conn.exec(command, (err, stream) => {
      let buf = [];
      if (err) {
        return reject();
      }
      stream.on('close', () => {
        if (encode === 'utf8') {
          this.emit('command:done', buf.toString());
        } else {
          this.emit('command:done', buf);
        }
      }).on('data', (data) => {
        buf = buf.concat(data);
        if (encode === 'utf8') {
          this.emit('command', data.toString());
          return;
        }
        this.emit('command', data);
      });
    })
  }

  /**
   * 写入到目标机器Shell
   * @param data
   */
  write(data) {
    this.stream && this.stream.write(data);
  }

  /**
   * 发送到前端
   */
  send(type, data) {
    this.ws.send(JSON.stringify({
      type, ...data
    }));
  }
}

module.exports = SshShellClient;
