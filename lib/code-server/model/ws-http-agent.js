const http = require('http');
const WebSocket = require('ws');
const BSON = require('bson');

/**
 * 构建基于WebSocket通讯的HTTP代理
 * 将原始请求直接无脑直接发送给WebSocket服务器
 *
 * 定义三种类型动作
 *
 * 建立连接
 * {
 *   type: 'ConnNew',
 *   data: {
 *      connId:''
 *   }
 * }
 *
 * {
 *   type: 'ConnEnd',
 *   data: {
 *     connId:''
 *   }
 * }
 *
 * {
 *   type: 'ConnData',
 *   data: {
 *   type:'http'|'ws',
 *
 *   }
 * }
 *
 *

 *
 */
class WsHTTPAgent extends EventEmitter {
  constructor() {
    super();
  }

  connect() {
    this.client = new WebSocket('ws://localhost:8080');
    this.client.on('message', (data) => {
      let opts = BSON.deserialize(data);
      this.emit(opts.type, opts.data);
    });
  }

  sendMessage(type, data) {
    this.client.send(BSON.serialize({type, data}));
  }

  sendStart() {
    return new Promise(resolve => {
      this.sendMessage('ConnNew', {});
      this.once('ConnNew', (data) => {
        resolve(data);
      })});
  }

  sendEnd() {
    this.sendMessage('ConnEnd', {});
  }
}

module.exports = {WsHTTPAgent};