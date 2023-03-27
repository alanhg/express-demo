const http = require('http');
const WebSocket = require('ws');


/**
 * 构建基于WebSocket通讯的HTTP代理
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
      socket.send(JSON.stringify({
        type: 'ws',
        data: options.path
      }));
      return;
    }

    socket = new WebSocket('ws://127.0.0.1:8000/ws/webshell', {
      headers: options.headers,
    });

    socket.on('open', () => {
      // 设置一个标志，以便在收到第一个消息后调用回调函数
      let firstMessageReceived = false;
      this.socketPool.push(socket);
      socket.on('message', (message) => {
        if (!firstMessageReceived) {
          const tcpSocket = socket._socket;
          cb(null, tcpSocket);
          firstMessageReceived = true;
        }
      });

      // 发
      socket.send(JSON.stringify({
        type: 'proxy',
        data: options.path
      }));
    });


    socket.on('error', () => {
    });


    socket.on('close', () => {
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