/**
 * 针对code-server-web进行iframe套娃，解决loading动画问题
 */
const express = require("express");
const {codeServerProxyManager, CodeServerCheck} = require("../model/proxy");
const {SshClient} = require("../model/ssh");
const router = express.Router();

router.get('/:proxyKey', (req, res) => {
  let proxyKey = req.params.proxyKey;
  let proxy = codeServerProxyManager.getProxy(proxyKey);
  if (!proxy) {
    res.send('no agent');
    return;
  }
  res.render('ide', {
    queryParams: new URLSearchParams(req.query),
    proxyKey,
    folder: req.query.folder,
    host: proxy.connectOpts.host,
    port: codeServerProxyManager.port,
    username: process.env.username,
  });
});

/**
 * 自动关闭code-server-web，但考虑到多TAB，最佳方式应该是agent不active的时候再做这件事
 */
router.ws('/:proxyKey', (socket, req) => {
  let proxyKey = req.params.proxyKey;
  let agentProxy = codeServerProxyManager.getProxy(proxyKey);
  const client = new SshClient();
  client.connect(agentProxy.connectOpts);
  client.on('ready', () => {
    const coderServerCheck = new CodeServerCheck(client);
    coderServerCheck.on('start-progress', (progress) => {
      console.log({
        type: 'start-ide', data: {
          status: 'starting', message: progress,
        },
      });
      socket.send(JSON.stringify({
        type: 'start-ide', data: {
          status: 'starting', message: progress,
        },
      }));
    });
    coderServerCheck.once('start-result', () => {
      socket.send(JSON.stringify({
        type: 'start-ide', data: {
          status: 'done',
        },
      }));
      coderServerCheck.getPassword().then((password) => {
        client.disconnect();
        socket.send(JSON.stringify({
          type: 'start-ide',
          data: {
            password: password.match(/[a-z0-9]{24}/)[0],
          },
        }));
      });
    })
    coderServerCheck.start();
    agentProxy.addActiveConnections();
  });
  socket.on('close', (event) => {
    console.log('ide-socket closed', event.code, event.reason, event.wasClean);
    let proxy = codeServerProxyManager.getProxy(proxyKey);
    proxy.destroyActiveConnections();
  })
});

module.exports = router;
