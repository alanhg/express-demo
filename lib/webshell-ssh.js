const {Client} = require("ssh2");
const CodeServerProxy = require("./code-server-proxy");
const {SshClient} = require("./ssh");

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

    this.ws.on('message', (msg) => {
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
            type: 'search', path: options.path, keyword: options.data, data: res.toString()
          }));
        })
      }
      /**
       * 远程执行脚本，启动codeserver
       * 1. 检测是否安装了codeserver,如果安装了直接启动，如果没有安装，执行安装脚本
       */
      if (options.type === 'codeserver') {
        this.execCommand('ws123').then(() => {
          const proxy = new CodeServerProxy();
          proxy.connect(this.config);
          proxy.on('ready', () => {
            this.send('codeserver', {
              message: 'run ok',
            })
            proxy.proxyCodeWeb().then(() => {

            })
          })
        }).catch(() => {

        })
      } else {
        this.write(options.data);
      }
    });
  }

  execCommand(command) {
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) {
          return reject();
        }
        stream.on('close', () => {
          resolve('');
        }).on('data', (data) => {
          resolve(data);
        });
      })
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
