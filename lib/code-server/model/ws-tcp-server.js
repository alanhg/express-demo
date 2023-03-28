const net = require('net');
const BSON = require('bson');


const server = net.createServer((clientSocket) => {
  // connect TAT-websocket

  // new websocket client
  const targetSocket = new WebSocket('ws://');

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
});


module.exports = server;
