const express = require("express");
const {codeServerProxyManager, codeServerProxy} = require("../model/proxy");
const router = express.Router();
const WebSocket = require('ws');

/**
 * http://127.0.0.1:8000/ws/1665154822948?folder=/home/lighthouse/.ssh
 *
 * /ws/e72c6b029f08a2f1ca927edf6732e8ee/ 视为rootPath替换为/，进行转发代理
 */
router.ws('*', function (socket, req) {
  const proxyKey = req.url.match(/(?<=^\/)[\da-z]+/);
  const path = req.url.replace(/(\/)[\da-z]+/, '');
  let targetWs;
  let httpAgent;
  const headers = req.headers;
  if (proxyKey) {
    httpAgent = codeServerProxyManager.getProxy(proxyKey[0]);
    if (!httpAgent) {
      return;
    }
    targetWs = new WebSocket(`${httpAgent.wsUrl}${path}`, [], {
      headers
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
  codeServerProxy.web(req, res, {target: httpAgent.url}, (e) => {
    const status = {
      ECONNREFUSED: 503, ETIMEOUT: 504
    }[e.code] || 500;
    res.writeHead(status, {
      'Content-Type': 'text/plain;charset=utf-8'
    });
    res.end(`error:${status}__${e.code}`);
  });
});

module.exports = router;
