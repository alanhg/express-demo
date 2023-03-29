const net = require('net');
const {EventEmitter} = require('events');

/**
 * 创建tcp server
 * 底层走websocket与目标服务通讯，直接传输socket数据
 */

class WsTCPAgent extends EventEmitter {
  constructor() {
    super();
  }

  forwardOut(_srcIP, _srcPort, _dstIP, _dstPort, cb) {
    const clientSocket = this.clientSocket;
    // new websocket client
    // sessionId
    const targetSocket = new WebSocket('ws://127.0.0.1:8000/ws/webshell');

    // 将从客户端接收到的数据转发到目标服务器
    clientSocket.on('data', (data) => {
      targetSocket.write(JSON.stringify({
        type: 'readFile',
        data:{
          data,
          socketId:'socketId'
        }
      }));
    });


    // 处理错误
    clientSocket.on('error', (err) => {
      console.error('Client socket error:', err);
      targetSocket.destroy();
      targetSocket.write(JSON.stringify({
        type: 'error',
        data:{
          data,
          socketId:'socketId'
        }
      }));
    });

    // 将从目标服务器接收到的数据转发回客户端
    targetSocket.on('message', (data) => {
      let opts = JSON.parse(data);
      clientSocket.write(opts.data);
    });

    targetSocket.on('error', (err) => {

    });

    targetSocket.on('open', () => {
      targetSocket.write(JSON.stringify({
        type: 'new',
        data: 'socketId',
      }));
    });
    cb(null, clientSocket);
  }

  end() {

  }

  connect(connectCfg) {
    const server = net.createServer((clientSocket) => {
      console.log('client connected');
      this.emit('ready');
      this.clientSocket = clientSocket;
    });
    server.on('error', (err) => {
      throw err;
    });
    server.listen(0, () => {
      console.log('Server is listening on port ' + server.address().port);
    });

    this._connectCfg = connectCfg;
    this.server = server;
  }
}

module.exports = WsTCPAgent;
