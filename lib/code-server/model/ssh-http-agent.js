'use strict';

const {Agent: SshHttpAgent} = require('http');
const {Agent: HttpsAgent} = require('https');
const {connect: tlsConnect} = require('tls');
const {SshTcpServer} = require('./ssh-tcp-server');

for (const ctor of [SshHttpAgent, HttpsAgent]) {
  class SSHAgent extends ctor {
    constructor(connectCfg, agentOptions) {
      super(agentOptions);

      this._connectCfg = connectCfg;
      this._defaultSrcIP = (agentOptions && agentOptions.srcIP) || 'localhost';
      this.server = new SshTcpServer();
    }

    createConnection(options, cb) {
      const srcIP = (options && options.localAddress) || this._defaultSrcIP;
      const srcPort = (options && options.localPort) || 0;
      const dstIP = options.host;
      const dstPort = options.port;
      this.server.connect(this._connectCfg, srcPort, srcIP, dstIP, dstPort).then(() => {
        this.server.forwardOut((err, stream) => {
          cb(null, decorateStream(stream, ctor, options));
        });
      });
    }
  }

  exports[ctor === SshHttpAgent ? 'SSHTTPAgent' : 'SSHTTPSAgent'] = SSHAgent;
}

function noop() {
}

function decorateStream(stream, ctor, options) {
  if (ctor === SshHttpAgent) {
    // HTTP
    stream.setKeepAlive = noop;
    stream.setNoDelay = noop;
    stream.setTimeout = noop;
    stream.ref = noop;
    stream.unref = noop;
    stream.destroySoon = stream.destroy;
    return stream;
  }

  // HTTPS
  options.socket = stream;
  const wrapped = tlsConnect(options);

  // This is a workaround for a regression in node v12.16.3+
  // https://github.com/nodejs/node/issues/35904
  const onClose = (() => {
    let called = false;
    return () => {
      if (called)
        return;
      called = true;
      if (stream.isPaused())
        stream.resume();
    };
  })();
  // 'end' listener is needed because 'close' is not emitted in some scenarios
  // in node v12.x for some unknown reason
  wrapped.on('end', onClose).on('close', onClose);

  return wrapped;
}
