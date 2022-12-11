const {Client} = require("ssh2");
const {SshClient} = require("./code-server/model/ssh");
const {codeServerProxyManager} = require("./code-server/model/proxy");

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
      if (typeof msg === 'object') {
        this.write(msg);
        return;
      }
      const options = JSON.parse(msg);
      if (options.type === 'search') {
        let command = `ug -r '${options.data}' -n -k -I ${options.path} --ignore-files`;
        /**
         * @see https://www.runoob.com/linux/linux-comm-grep.html
         * -a 或 --text : 不要忽略二进制的数据。
         * -i 或 --ignore-case : 忽略字符大小写的差别。
         *
         */
        this.execCommandStream(command).then(res => {
          this.ws.send(JSON.stringify({
            type: 'search', path: options.path, keyword: options.data, data: res.toString()
          }));
        })
      }

      if (options.type === 'codeserver') {
        let proxyKey = codeServerProxyManager.createProxy(connectOpts);
        this.send('codeserver', {
          host: this.config.host,
          proxyKey
        });
      } else {
        this.write(options.data);
      }
    });
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
