const express = require("express");
const {codeServerProxifier} = require("../model/proxy");
const router = express.Router();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer({
  ws: true
});

/**
 * http://127.0.0.1:8000/ws/1665154822948?folder=/home/lighthouse/.ssh
 *
 * /ws/e72c6b029f08a2f1ca927edf6732e8ee/ 视为rootPath替换为/，进行转发代理
 */

apiProxy.on('proxyReq', function (proxyReq, req, res, options) {
  console.log('proxyReq', proxyReq.path);
});

router.all('*', async (req, res) => {
  const proxyKey = req.url.match(/(?<=^\/)[\da-z]+/);
  let httpAgent;
  if (proxyKey) {
    httpAgent = codeServerProxifier.getProxy(proxyKey[0]);
    if (!httpAgent) {
      res.send('no agent');
      return;
    }
  }
  req.url = req.url.replace(/^\/[\da-z]*/, '');
  apiProxy.web(req, res, {target: httpAgent.url});
});

module.exports = router;
