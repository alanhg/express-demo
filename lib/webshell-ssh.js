const {Client} = require("ssh2");
const CodeServerProxy = require("./code-server-proxy");
const {SshClient} = require("./ssh");
const {commands} = require("./code-server-proxy");

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
        this.execCommand(commands.checkService);
        const codeServerServiceStatus = await new Promise(resolve => {
          this.once('command', (codeServerStatus) => {
            resolve(codeServerStatus);
          })
        });

        if (codeServerServiceStatus.match(/^unknown/)) {
          this.execCommand(`which code-server`);
          const codeServerInstallStatus = await new Promise(resolve => {
            this.once('command', (codeServerInstallStatus) => {
              resolve(codeServerInstallStatus);
            })
          });
          if (codeServerInstallStatus.match(/\/usr\/bin\/which: no code-server/)) {
            // 执行安装
            this.execCommand(`curl -fsSL https://raw.githubusercontent.com/cdr/code-server/main/install.sh | sh`);
            this.on('command', (installProcess) => {
              console.log('Class: SshShellClient, Function: , Line 64, Param: ', installProcess);
            });
          }
          this.execCommand(`sudo systemctl enable --now code-server@$USER`);
        } else if (codeServerServiceStatus.match(/^inactive/)) {
          // 执行启动
          this.execCommand(`sudo systemctl start code-server@$USER`);
        }
        this.once('command:done', () => {

        })
        if (codeServerServiceStatus.match(/^active/)) {
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
      if (err) {
        return reject();
      }
      stream.on('close', () => {
        this.emit('command:done');
      }).on('data', (data) => {
        if (encode === 'utf8') {
          this.emit('command', data.toString());
          return;
        }
        this.emit('command', data);
      });
    })
  }

  write(data) {
    this.stream && this.stream.write(data);
  }

  send(type, data) {
    this.ws.send(JSON.stringify({
      type, ...data
    }));
  }
}

module.exports = SshShellClient;
