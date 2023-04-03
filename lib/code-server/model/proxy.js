const {EventEmitter} = require('events');
const httpProxy = require('http-proxy');
const pathMatch = require('path-match');
const {SSHTTPAgent} = require('./ssh-http-agent');
const route = pathMatch({
  // path-to-regexp options
  sensitive: false, strict: false, end: false,
});


// 实际目标机器codeserver端口,绑定端口可以在启动安装时定制
const remoteCodeServerPort = 36000;
const {Agent} = require('http');
const {WsHTTPAgent} = require('./ws-http-agent');

function buildProxyKey({username, host}) {
  return Buffer.from(`${username}@${host}`, 'utf8').toString('base64');
}

/**
 * SSH协议代理下需要缓存SSH连接信息，HTTP协议代理下因为外网IP访问，并不需要
 */
class CodeServerProxyManager extends EventEmitter {
  constructor(ip, port) {
    super();
    /**
     * key为proxyId,value为Proxy实体，方便动态代理到目标机器
     * @see Proxy
     */
    this.codeServerPool = new Map();
    this.ip = ip;
    this.port = port;
    this.url = `${ip}:${port}`;
  }

  /**
   * 应该根据username+host唯一确定一个连接
   * proxyProtocol: http|ssh
   */
  async createProxy(connectOpts, proxyProtocol = 'http') {
    try {
      const proxyKey = buildProxyKey(connectOpts);
      const proxy = new Proxy({connectOpts, proxyKey, proxyProtocol});
      this.codeServerPool.set(proxyKey, proxy);
      return proxy;
    } catch (e) {
      console.error(e);
      return {}
    }
  }

  getProxy(proxyKey) {
    let proxy = this.codeServerPool.get(proxyKey);
    if (proxy) {
      return proxy;
    }
    return null
  }

  async deleteProxy(proxy) {
    this.codeServerPool.delete(proxy.proxyKey);
  }
}

class Proxy {

  constructor(proxyConfig) {
    this.config = proxyConfig;
    this.proxyKey = proxyConfig.proxyKey;
    this.proxyProtocol = proxyConfig.proxyProtocol;
    this.build(proxyConfig.connectOpts, proxyConfig.proxyProtocol);
  }

  /**
   * 正向代理
   */
  build(connectOpts = {}, proxyProtocol) {
    this.connectOpts = connectOpts;
    if (proxyProtocol === 'http') {
      this.agent = new Agent({keepAlive: true, timeout: 20 * 1000});
    }
    if (proxyProtocol === 'ws') {
      // 底层为ws
      this.agent = new WsHTTPAgent(connectOpts, {keepAlive: true, maxSockets: 3});
    } else {
      this.agent = new SSHTTPAgent(connectOpts, {
        keepAlive: false,
        timeout: 70 * 1000,
        maxSockets: 1
      });
    }
    return this;
  }

  get url() {
    if (this.proxyProtocol === 'ssh') {
      return `http://127.0.0.1:${remoteCodeServerPort}`;
    }
    if (this.proxyProtocol === 'ws') {
      return `http://127.0.0.1:${remoteCodeServerPort}`;
    }
    return `http://${this.connectOpts.host}:${remoteCodeServerPort}`;
  }

  get wsUrl() {
    if (this.proxyProtocol === 'ssh') {
      return `ws://127.0.0.1:${remoteCodeServerPort}`;
    }
    if (this.proxyProtocol === 'ws') {
      return `ws://127.0.0.1:${remoteCodeServerPort}`;
    }
    return `ws://${this.connectOpts.host}:${remoteCodeServerPort}`;
  }
}

/**
 * code server操作相关命令
 */
const COMMANDS = {
  initEnv: ['export CODE_SERVER_PORT=36000', 'export CODE_SERVER_DIR=$HOME/.term/code-server', 'export CODE_SERVER_RUN_DIR=$HOME/.term/code-server-run', 'export BIND_ADDR=127.0.0.1:$CODE_SERVER_PORT', 'export USER_DATA_PATH=$CODE_SERVER_DIR/share', 'export CONFIG_PATH=$CODE_SERVER_DIR/.config/config.yaml', 'export EXTENSION_PATH=$CODE_SERVER_DIR/share/extensions', 'PATH="$CODE_SERVER_DIR/bin:$PATH"',],
  /**
   * 脚本参考 @see lib/code-server/code-server-install-v1.3.sh
   *
   * code-server安装配置有最低要求,1 GB of RAM, 2 CPU cores
   * @see https://coder.com/docs/code-server/latest/requirements
   */
  startService: () => {
    const installShellName = 'code-server-install-v1.7.sh';
    const uninstallShellName = 'code-server-uninstall-v0.1.sh';

    return `if [ ! -e $HOME/.term/${installShellName} ];then
mkdir -p $HOME/.term
curl -sSo $HOME/.term/${installShellName} https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/${installShellName} && sh $HOME/.term/${installShellName}
else 
sh $HOME/.term/${installShellName}
fi

  if [ ! -e $HOME/.term/${uninstallShellName} ];then
  mkdir -p $HOME/.term
  curl -sSo $HOME/.term/${uninstallShellName} https://raw.githubusercontent.com/alanhg/express-demo/master/lib/code-server/model/${uninstallShellName}
  fi
`

  },

  // 停止服务
  get stopService() {
    return ['pkill -f ".term/code-server"'];
  },

  checkVersion: 'code-server --version'
};
const REMOTE_CODE_SERVER_PORT = 36000;
const REMOTE_CODE_SERVER_IP = '127.0.0.1';
const codeServerProxyManager = new CodeServerProxyManager(REMOTE_CODE_SERVER_IP, REMOTE_CODE_SERVER_PORT);

/**
 * 走SSH方式检查/安装/启动code-server
 */
class CodeServerStarter extends EventEmitter {
  constructor(sshClient) {
    super();
    this.sshClient = sshClient;
  }

  /**
   * 返回proxyId，用于唯一识别代理
   * @returns {Promise<string>}
   */
  async start() {
    this.sshClient.execCommandStream(COMMANDS.startService());
    const sendProgress = buf => {
      this.emit('start-progress', buf.toString());
    };
    this.sshClient.on('command', sendProgress);
    this.sshClient.once('command:done', () => {
      this.emit('start-result');
      this.sshClient.removeListener('command', sendProgress);
    });
  }
}

/**
 * 创建代理服务器，执行动态代理
 */
const proxyServer = httpProxy.createProxyServer({
  secure: false, ws: false, changeOrigin: false, hostRewrite: true, timeout: 20 * 1000, proxyTimeout: 20 * 1000,
});

proxyServer.on('proxyRes', (proxyRes, req) => {

  let csp = proxyRes.headers['content-security-policy'];
  if (csp) {
    csp = csp
        .replace('default-src', `default-src https://static.1991421.cn`)
        .replace('script-src', `script-src https://static.1991421.cn`)
        .replace('style-src', `style-src https://static.1991421.cn`)
        .replace('font-src', `font-src https://static.1991421.cn`)
        .replace('manifest-src', `manifest-src https://static.1991421.cn`)
        .replace('img-src', `img-src https://static.1991421.cn`)
        .replace('media-src', `media-src https://static.1991421.cn`)
        .replace('child-src', `child-src https://static.1991421.cn`)
        .replace('frame-src', `frame-src https://static.1991421.cn`)
        .replace('worker-src', `worker-src https://static.1991421.cn blob:`)
        .replace('connect-src', `connect-src https://static.1991421.cn`);
    proxyRes.headers['content-security-policy'] = csp;
  }
});


module.exports.codeServerProxyManager = codeServerProxyManager;
module.exports.CodeServerCheck = CodeServerStarter;
module.exports.CodeServerCommands = COMMANDS;
module.exports.codeServerProxy = proxyServer;
module.exports.route = route;
