const http = require('http');
const WebSocket = require('ws');
const BSON = require('bson');
const {Agent: SshHttpAgent} = require('http');
const {connect: tlsConnect} = require('tls');

let Client;

/**
 * 构建基于WebSocket通讯的HTTP代理
 */
class WsHTTPAgent extends http.Agent {
  constructor(connectCfg, agentOptions) {
    super(agentOptions);
    this._connectCfg = connectCfg;
  }

  createConnection(options, cb) {
    const srcIP = (options && options.localAddress) || this._defaultSrcIP;
    const srcPort = (options && options.localPort) || 0;
    const dstIP = options.host;
    const dstPort = options.port;

    if (Client === undefined)
      Client = require('../ws-tcp-server.js');
    const client = new Client();
    let triedForward = false;
    client.on('ready', () => {
      client.forwardOut(srcIP, srcPort, dstIP, dstPort, (err, stream) => {
        triedForward = true;
        if (err) {
          client.end();
          return cb(err);
        }
        stream.once('close', () => client.end());
        cb(null, decorateStream(stream, http.Agent, options));
      });
    }).on('error', cb).on('close', () => {
      if (!triedForward)
        cb(new Error('Unexpected connection close'));
    });
  };
}

function noop() {}

function decorateStream(stream) {
    stream.setKeepAlive = noop;
    stream.setNoDelay = noop;
    stream.setTimeout = noop;
    stream.ref = noop;
    stream.unref = noop;
    stream.destroySoon = stream.destroy;
    return stream;
}


module.exports = {WsHTTPAgent};