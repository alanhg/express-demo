/**
 * SSH/HTTP协议代理测试
 */
const http = require('http');

const {Client, HTTPAgent, HTTPSAgent} = require('ssh2');
const httpProxy = require('http-proxy');

const {connectOpts} = require('../constants/config')
const sshConfig = connectOpts;

// Use `HTTPSAgent` instead for an HTTPS request
const agent = new HTTPAgent(sshConfig);

/**
 * 创建代理服务器，执行动态代理
 */
const TIMEOUT = 3 * 60 * 1000;
const proxyServer = httpProxy.createProxyServer({
  secure: false,
  ws: false,
  autoRewrite: true,
  changeOrigin: false,
  hostRewrite: true,
  proxyTimeout: TIMEOUT,
  timeout: TIMEOUT,
  // agent
});


console.log(sshConfig);


//
// http.get({
//   host: '127.0.0.1',
//   port: 36000,
//   agent,
//   headers: {Connection: 'close'}
// }, (res) => {
//   console.log(res.statusCode);
//   console.dir(res.headers);
//   res.resume();
// });

http.createServer(function (req, res) {
  proxyServer.web(req, res, {target: 'http://127.0.0.1:36000', agent});
}).listen(9000);

console.log('see http://127.0.0.1:9000');