const {Client} = require('ssh2');
const {SshClient} = require('./code-server/model/ssh');
const {codeServerProxyManager, CodeServerCommands} = require('./code-server/model/proxy');
const {connectOpts} = require('../constants/config');

class SshShellClient extends SshClient {
  constructor(ws) {
    super(new Client());
    this.ws = ws;
    this.init();
  }

  init() {
    const handleMap = {
      connect: this.connect,
      search: this.search,
      codeserver: this.runCodeServer,
      'codeserver-logout': this.logoutCodeServer,
      proxy: () => {
        this.send('proxy', 'hello world');
      },
      'websocket-proxy': async () => {
        // 手动录入WS代理测试数据
        await codeServerProxyManager.createProxy(connectOpts, 'ws');
        this.send('websocket-proxy', 'hello world');
      },
      'exec-command': async (options) => {
        this.send('exec-command', {
          command: options.data.command,
          data: (await this.execCommand(options.data.command)).toString()
        });
      }

    };
    this.ws.on('message', async (msg) => {
      if (typeof msg === 'object') {
        this.write(msg);
        return;
      }
      const options = JSON.parse(msg);
      if (handleMap[options.type]) {
        handleMap[options.type].call(this, options);
      } else {
        this.write(options.data);
      }
    })
  }

  logoutCodeServer() {
    // 登录时，如果没有活跃连接就自动关闭服务
    this.execCommand(CodeServerCommands.stopService).then(res => {
      codeServerProxyManager.deleteProxy(connectOpts);
      this.send('codeserver-logout');
    })
  }

  async runCodeServer(options) {
    let {proxyKey} = await codeServerProxyManager.createProxy(connectOpts, options.data.proxyProtocol);
    this.send('codeserver', {
      host: this.config.host,
      proxyKey,
      proxyProtocol: options.data.proxyProtocol,
    });
  }

  search(options) {
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

  connect({data: connectOpts}) {
    this.config = {tryKeyboard: false, ...connectOpts};
    this.conn.connect(this.config);
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
        // s.write('exec /bin/sh\n'); // 执行切换Shell命令
        // s.write('echo 123\n'); // 执行切换Shell命令
        // s.write('clear\n');
      });
      this.emit('ready');
    });
    this.conn.on('close', (e) => {
      this.emit('close', e);
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
