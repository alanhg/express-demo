const http = require('http');
const WebSocket = require('ws');
const BSON = require('bson');


/**
 * 构建基于WebSocket通讯的HTTP代理
 */
class WsHTTPAgent extends http.Agent {
  constructor(connectCfg, agentOptions) {
    super(agentOptions);
    this._connectCfg = connectCfg;
  }

  createConnection(options, cb) {
    const socket=new Server();
    cb(null,socket);
  };
}

module.exports = {WsHTTPAgent};