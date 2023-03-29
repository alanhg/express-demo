const net = require('net');
const BSON = require('bson');


/**
 * 创建tcp server
 * 底层走websocket与目标服务通讯，直接传输socket数据
 */

class WsTCPAgent extends EventEmitter {
  constructor() {
    super();
    this.createServer();
  }

  createServer() {
    this.server = net.createServer((clientSocket) => {
      this.emit('ready');
      this.clientSocket = clientSocket;
    });
  };

  forwardOut(_srcIP, _srcPort, _dstIP, _dstPort, cb) {
    const clientSocket = this.clientSocket;
    // new websocket client
    const targetSocket = new WebSocket('ws://127.0.0.1:8000/ws/webshell');

    // 将从客户端接收到的数据转发到目标服务器
    clientSocket.on('data', (data) => {
      targetSocket.write(BSON.serialize({
        type: 'readFile',
        data
      }));
    });


    // 处理错误
    clientSocket.on('error', (err) => {
      console.error('Client socket error:', err);
      targetSocket.destroy();
    });

    // 将从目标服务器接收到的数据转发回客户端
    targetSocket.on('message', (data) => {
      let opts = BSON.deserialize(data);
      clientSocket.write(opts.data);
    });

    targetSocket.on('error', (err) => {

    });

    targetSocket.on('open', () => {

    });
    cb(null, clientSocket);
  }
}

module.exports = WsTCPAgent;
