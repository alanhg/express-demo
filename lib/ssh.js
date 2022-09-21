const {Client} = require('ssh2');
const EventEmitter = require("events");

class SshClient extends EventEmitter {
  constructor(ws) {
    super();
    this.conn = new Client();
    this.ws = ws;
  }


  connect(config) {
    this.config = config;
    this.conn.connect(config);
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
      if (options.type === 'codeserver') {
        this.execCommand('ws').then(() => {
          // const proxy = new CodeServerProxy();
          // proxy.connect(sshClient.config);
          // proxy.on('ready', () => {
          //   proxy.proxyCodeWeb().then(() => {
          //     ws.send(JSON.stringify({
          //       type: 'codeserver'
          //     }));
          //   })
          // });
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
          this.conn.end();
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
}

module.exports = SshClient;
