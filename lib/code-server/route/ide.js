/**
 * 针对code-server-web进行iframe套娃，解决loading动画问题
 */
const express = require("express");
const {codeServerProxifier, CodeServerCheck} = require("../model/proxy");
const {SshClient} = require("../model/ssh");
const router = express.Router();

const connectOpts = {
  host: process.env.host, port: 22, username: process.env.username || 'root', password: process.env.password
};

router.get('/:proxyKey', (req, res) => {
  let proxyKey = req.params.proxyKey;
  if (!codeServerProxifier.getProxy(proxyKey)) {
    res.send('no agent');
    return;
  }
  res.render('ide', {
    queryParams: new URLSearchParams(req.query), proxyKey, folder: req.query.folder
  });
});

/**
 * 自动关闭code-server-web，但考虑到多TAB，最佳方式应该是agent不active的时候再做这件事
 */
router.ws('/:proxyKey', (ws, req) => {
  let proxyKey = req.params.proxyKey;
  let proxy1 = codeServerProxifier.getProxy(proxyKey);
  const client = new SshClient();
  client.connect(proxy1.connectOpts);
  client.on('ready', async () => {
    const coderServerCheck = new CodeServerCheck(client);
    const status = await coderServerCheck.start();
    client.disconnect();
    ws.send(JSON.stringify({
      type: 'start-ide', data: {
        status
      }
    }));
    let proxyKey = codeServerProxifier.buildProxyKey(connectOpts);
    let proxy = codeServerProxifier.getProxy(proxyKey);
    proxy.addActiveConnections();
  });
  ws.on('close', (e) => {
    let proxyKey = codeServerProxifier.buildProxyKey(connectOpts);
    let proxy = codeServerProxifier.getProxy(proxyKey);
    proxy.destroyActiveConnections();
  })
});

module.exports = router;
