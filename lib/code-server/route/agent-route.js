const express = require("express");
const axios = require("axios");
const {codeServerProxifier} = require("../model/proxy");
const querystring = require("querystring");
const router = express.Router();
const WebSocket = require('ws');
/**
 * 针对code-server-web进行请求代理转发，包含HTTP+WS两部分
 * @type {e | (() => Express)}
 */
router.ws('*', function (socket, req) {
  const proxyKey = req.url.match(/(?<=^\/)[\da-z]+/);
  const path = req.url.replace(/(\/)[\da-z]+/, '');
  let targetWs;
  let httpAgent;
  const headers = req.headers;
  if (proxyKey) {
    httpAgent = codeServerProxifier.getProxy(proxyKey[0]).agent;
    if (!httpAgent) {
      return;
    }
    targetWs = new WebSocket(`ws://${codeServerProxifier.url}${path}`, [], {
      agent: httpAgent, headers
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

/**
 * http://127.0.0.1:8000/ws/1665154822948?folder=/home/lighthouse/.ssh
 *
 * /ws/e72c6b029f08a2f1ca927edf6732e8ee/ 视为rootPath替换为/，进行转发代理
 */
router.all('*', async (req, res) => {
  const proxyKey = req.url.match(/(?<=^\/)[\da-z]+/);
  let httpAgent;
  if (proxyKey) {
    httpAgent = codeServerProxifier.getProxy(proxyKey[0]).agent;
    if (!httpAgent) {
      res.send('no agent');
      return;
    }
  }
  let url = req.url.replace(/^\/[\da-z]*/, '');
  const headers = req.headers;
  const bodyData = req.body;

  /**
   * 根据ID确定需要连接的httpAgent
   */

  try {
    const proxyRes = await axios({
      headers,
      baseURL: `http://${codeServerProxifier.url}`,
      method: req.method,
      url,
      data: bodyData,
      httpAgent,
      maxRedirects: 0,
      responseType: 'stream'
    });
    res.set(proxyRes.headers).status(proxyRes.status)
    proxyRes.data.pipe(res);
  } catch (e) {
    const {response} = e;
    /**
     * 遇到该类报错，尝试重试一次
     * (SSH) Channel open failure: Connection refused
     */
    if (response) {
      res.set(response.headers).status(response.status)
      response.data.pipe(res);
    } else {
      res.status(500).send(e.message);
    }
  }
});

module.exports = router;
