const http = require('http');
const WebSocket = require('ws');


/**
 * A借助B代理，发送到C数据
 */
 class WsHTTPAgent extends http.Agent {
  constructor(options) {
    super(options);
    this.options = options;
    this.socketPool = [];
  }

  createConnection(options, cb) {
    // B到C的连接

    // 尝试从连接池中获取可用的连接
    let socket = this.getAvailableSocket();
    if (socket) {
      cb(socket);
      return;
    }

    socket = new WebSocket(options.href, {
      headers: options.headers,
    });

    socket.on('open', () => {
      this.socketPool.push(socket);
      socket.on('message', (message) => {
        const response = message.toString();
        cb(response);
      });
    });
  }

  getAvailableSocket() {
    for (let i = 0; i < this.socketPool.length; i++) {
      const socket = this.socketPool[i];
      if (socket.readyState === WebSocket.OPEN) {
        // 可用的连接
        this.socketPool.splice(i, 1);
        return socket;
      }
    }
    return null; // 没有可用的连接
  }
}

module.exports = {WsHTTPAgent};