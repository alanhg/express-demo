const express = require('express');
const {codeServerProxyManager, codeServerProxy, route} = require('./proxy');
const router = express.Router();
const WebSocket = require('ws');

/**
 * http://127.0.0.1:8000/ws/1665154822948?folder=/home/lighthouse/.ssh
 *
 * /ws/e72c6b029f08a2f1ca927edf6732e8ee/ 视为rootPath替换为/，进行转发代理
 */
router.ws('*', async function (socket, req) {
  const match = route(`/tty/:proxyKey`);
  const params = match(req.originalUrl);
  const proxyKey = params.proxyKey;
  const path = req.url.replace(`/${proxyKey}`, '');
  let targetWs;
  let proxy;
  const headers = req.headers;
  if (proxyKey) {
    proxy = await codeServerProxyManager.getProxy(proxyKey);
    if (!proxy) {
      return;
    }
    targetWs = new WebSocket(`${proxy.wsUrl}${path}`, [], {
      headers,
      agent: proxy.agent,
    });
  }
  let pendingMsgToServer = [];
  socket.on('message', function (msg) {
    if (targetWs.readyState !== 1) {
      pendingMsgToServer.push(msg);
    } else {
      targetWs.send(msg);
    }
  });

  socket.on('close', function (event) {
    console.log('前后端socket close', event.code, event.reason, event.wasClean);
    targetWs && targetWs.readyState === 1 && targetWs.close();
  });
  targetWs.on('open', () => {
    while (pendingMsgToServer.length > 0) {
      targetWs.send(pendingMsgToServer.shift());
    }
  });
  targetWs.on('error', (event) => {
    console.log('目标机器socket error', event.code, event.reason, event.wasClean);
  });
  targetWs.on('close', (event) => {
    console.log('目标机器socket close', event.code, event.reason, event.wasClean);
  });

  targetWs.on('message', (msg2) => {
    socket.send(msg2);
  });
});

router.all('*', async (req, res) => {
  const match = route(`/tty/:proxyKey`);
  const params = match(req.originalUrl);
  const proxyKey = params.proxyKey;
  let proxy;
  if (proxyKey) {
    proxy = await codeServerProxyManager.getProxy(proxyKey);
    if (!proxy) {
      res.send('no agent');
      return;
    }
  }
  req.oldUrl = req.url;
  req.url = req.url.replace(`/${proxyKey}`, '');
  console.log('req.url', req.url)

  try {
    await new Promise((resolve, reject) => {
      res.on('finish', () => {
        console.log('finish', req.oldUrl);
      });

      res.on('close', () => {
        console.log('close', req.oldUrl);
        resolve();
      });
      let canRetries = 1; // 重试次数

      const doRequest = () => {
        codeServerProxy.web(req, res, {target: proxy.url, agent: proxy.agent}, (e) => {
          if (canRetries > 0) {
            canRetries = canRetries - 1;
            doRequest(canRetries, reject);
          } else {
            reject(e);
          }
        });
      }
      doRequest();
    });
  } catch (e) {
    console.log('error', e);
    const status = {
      ECONNREFUSED: 503, ETIMEOUT: 504
    }[e.code] || 500;
    res.writeHead(status, {
      'Content-Type': 'text/plain;charset=utf-8'
    });
    res.end(`error:${status}__${e.code}`);
  }
});

module.exports = router;