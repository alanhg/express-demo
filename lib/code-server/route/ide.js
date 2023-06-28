/**
 * 针对code-server-web进行iframe套娃，解决loading动画问题
 */
const express = require('express');
const {codeServerProxyManager, CodeServerCheck} = require('../model/proxy');
const {SshClient} = require('../model/ssh');
const {connectOpts} = require('../../../routes/config');
const router = express.Router();
router.get('/:proxyKey', async (req, res) => {
  let proxyKey = req.params.proxyKey;
  let proxy = await codeServerProxyManager.getProxy(proxyKey);
  if (!proxy) {
    res.send('no agent');
    return;
  }
  res.render('ide', {
    queryParams: new URLSearchParams(req.query),
    proxyKey,
    folder: req.query.folder,
    host: proxy.host,
    port: codeServerProxyManager.port,
    username: process.env.username,
  });
});

/**
 * 自动关闭code-server-web，但考虑到多TAB，最佳方式应该是agent不active的时候再做这件事
 */
router.ws('/:proxyKey', (socket, req) => {
  const client = new SshClient();
  client.connect(connectOpts);
  client.on('ready', () => {
    const coderServerCheck = new CodeServerCheck(client);
    coderServerCheck.on('start-progress', (progress) => {
      console.log('progress', progress);
      socket.send(JSON.stringify({
        type: 'start-ide', data: {
          status: 'starting', message: progress,
        },
      }));
    });
    /**
     * 启动成功后需要将密码传给前台，用于自动登录
     */
    coderServerCheck.once('start-result', () => {
      socket.send(JSON.stringify({
        type: 'start-ide', data: {
          status: 'done',
        },
      }));
      // coderServerCheck.getPassword().then((password) => {
      //   client.disconnect();
      //   socket.send(JSON.stringify({
      //     type: 'start-ide',
      //     data: {
      //       password,
      //     },
      //   }));
      // });
    })
    coderServerCheck.start();
  });
  socket.on('close', (event) => {
  })
});

module.exports = router;
