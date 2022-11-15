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
codeServerProxifier.createProxy(connectOpts);

router.get('/:proxyKey', (req, res) => {
  let proxyKey = req.params.proxyKey;
  if (!codeServerProxifier.getProxy(proxyKey)) {
    res.send('no agent');
    return;
  }
  res.render('ide', {
    queryParams: new URLSearchParams(req.query),
    proxyKey,
    folder: req.query.folder,
    host: process.env.host,
    username: process.env.username,
  });
});

/**
 * 自动关闭code-server-web，但考虑到多TAB，最佳方式应该是agent不active的时候再做这件事
 */
router.ws('/:proxyKey', (socket, req) => {
  let proxyKey = req.params.proxyKey;
  let agentProxy = codeServerProxifier.getProxy(proxyKey);
  const client = new SshClient();
  client.connect(agentProxy.connectOpts);
  client.on('ready', async () => {
    const coderServerCheck = new CodeServerCheck(client);
    coderServerCheck.on('start-progress', (progress) => {
      console.log({
        type: 'start-ide', data: {
          status: 'starting',
          message: progress,
        },
      });
      socket.send(JSON.stringify({
        type: 'start-ide', data: {
          status: 'starting',
          message: progress,
        },
      }));
    });
    coderServerCheck.on('start-result', () => {
      socket.send(JSON.stringify({
        type: 'start-ide',
        data: {
          status: 'done',
        },
      }));
    })
    await coderServerCheck.start();
    client.disconnect();
    agentProxy.addActiveConnections();
  });
  socket.on('close', (e) => {
    let proxy = codeServerProxifier.getProxy(proxyKey);
    proxy.destroyActiveConnections();
  })
});

module.exports = router;
