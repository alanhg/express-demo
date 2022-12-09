const express = require("express");
const {codeServerProxyManager, codeServerProxy, CodeServerCheck} = require("../model/proxy");
const {SshClient} = require("../model/ssh");
const router = express.Router();

/**
 * http://127.0.0.1:8000/ws/1665154822948?folder=/home/lighthouse/.ssh
 *
 * /ws/e72c6b029f08a2f1ca927edf6732e8ee/ 视为rootPath替换为/，进行转发代理
 */
// router.ws('*', (socket, req) => {
//   const proxyKey = req.url.match(/(?<=^\/)[\da-z]+/);
//   let httpAgent;
//   if (proxyKey) {
//     httpAgent = codeServerProxyManager.getProxy(proxyKey[0]);
//     if (!httpAgent) {
//       return;
//     }
//   }
//   req.url = req.url.replace(/^\/[\da-z]*/, '');
//   codeServerProxy.ws(req, socket, null, {
//     target: httpAgent.url
//   });
// });

router.all('*', async (req, res) => {
  const proxyKey = req.url.match(/(?<=^\/)[\da-z]+/);
  let httpAgent;
  if (proxyKey) {
    httpAgent = codeServerProxyManager.getProxy(proxyKey[0]);
    if (!httpAgent) {
      res.send('no agent');
      return;
    }
  }
  req.url = req.url.replace(/^\/[\da-z]*/, '');
  codeServerProxy.web(req, res, {target: httpAgent.url});
});

module.exports = router;
