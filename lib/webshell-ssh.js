const {Client} = require("ssh2");
const CodeServerProxy = require("./code-server/code-server-proxy");
const {SshClient} = require("./code-server/ssh");
const {commands} = require("./code-server/code-server-proxy");
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
        let codeServerServiceStatus = await this.execCommandPromisefy(commands.checkService);

        if (codeServerServiceStatus.match(/^unknown/)) {
          const codeServerInstallStatus = this.execCommandPromisefy(`which code-server`);
          if (codeServerInstallStatus.match(/\/usr\/bin\/which: no code-server/)) {
            // 执行安装
            await this.execCommandPromisefy(`curl -fsSL https://raw.githubusercontent.com/cdr/code-server/main/install.sh | sh`);
          }
          await this.execCommandPromisefy(`sudo systemctl enable --now code-server@$USER`);
          console.log('当前服务未创建，自动创建code server服务，启动'.info);
        } else if (codeServerServiceStatus.match(/^inactive/)) {
          // 执行启动
          await this.execCommandPromisefy(`sudo systemctl start code-server@$USER`);
          codeServerServiceStatus = await this.execCommandPromisefy(commands.checkService);
          console.log('服务当前未启动，自动开启code server服务'.info);
        }
        if (codeServerServiceStatus.match(/^active/)) {
          console.log('服务已启动，自动开启代理code server服务'.info);
          const proxy = new CodeServerProxy();
          proxy.connect(this.config);
          proxy.on('ready', () => {
            this.send('codeserver', {
              message: 'run ok',
            })
            proxy.proxyCodeWeb().then(() => {

            })
          })
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

  /**
   * promise化命令执行，返回命令输出的完整结果
   */
  execCommandPromisefy(command, encode = 'utf8') {
    return new Promise(resolve => {
      this.execCommand(command, encode);
      this.once('command:done', (data) => {
        resolve(data);
      })
    })
  }
}

module.exports = SshShellClient;
