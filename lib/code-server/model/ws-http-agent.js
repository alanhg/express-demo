const http = require('http');
const WebSocket = require('ws');


/**
 *
 */
 class WsHTTPAgent extends http.Agent {
   constructor(connectCfg, agentOptions) {
    super(agentOptions);
    this._connectCfg = connectCfg;
    this.socketPool = [];
  }

  createConnection(options, cb) {
    // B到C的连接

    // 尝试从连接池中获取可用的连接
    let socket = this.getAvailableSocket();
    if (socket) {
      socket.send({
        type: 'ws',
        data: options.path
      })
      cb(socket);
      return;
    }

    socket = new WebSocket('ws://127.0.0.1:8000/ws/webshell', {
      headers: options.headers,
    });

    socket.on('open', () => {
      this.socketPool.push(socket);
      socket.on('message', (message) => {
        const response = message.toString();
        cb(response);
      });

      // 发
      socket.send({
        type: 'proxy',
        data: options.path
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