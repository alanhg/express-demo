const http = require('http');
const WebSocket = require('ws');


/**
 * A借助B代理，发送到C数据
 */
 class WsHTTPAgent extends http.Agent {
  constructor(options) {
    super(options);
    this.options = options;
  }

  createConnection(options, cb) {
    // B到C的连接
    const socket = new WebSocket(options.href, {
      headers: options.headers,
    });
    socket.on('open', () => {
      // 接收C的数据
      socket.on('message', (message) => {
        // 处理返回的HTTP响应
        const response = message.toString();
        cb(response);
      });
    });
  }
}

module.exports = {WsHTTPAgent};