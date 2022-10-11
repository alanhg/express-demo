/**
 * 针对code-server-web进行请求代理转发
 * @type {e | (() => Express)}
 */
const express = require("express");
const axios = require("axios");
const {codeServerProxifier} = require("./code-server-proxy");
const querystring = require("querystring");
const router = express.Router();
const WebSocket = require('ws');
const chalk = require("chalk");

router.ws('*', function (ws, req) {
  const proxyKey = req.url.match(/(?<=^\/)[\da-z]+/);
  const path = req.url.replace(/(\/)[\da-z]+/, '');
  let targetWs;
  const headers = req.headers;
  if (proxyKey) {
    const httpAgent = codeServerProxifier.getProxy(proxyKey[0]);
    if (!httpAgent) {
      return;
    }
    targetWs = new WebSocket(`ws://${codeServerProxifier.url}${path}`, [], {
      agent: httpAgent, headers
    });
  }
  let pendingMsgToServer = [];
  ws.on('message', function (msg) {
    if (targetWs.readyState !== 1) {
      pendingMsgToServer.push(msg);
    } else {
      targetWs.send(msg);
    }
  });

  ws.on('close', function (msg) {
    console.log(chalk.red('连接已断开', `对应proxyKey是${proxyKey}`));
  });
  targetWs.on('open', () => {
    console.log('socket open');
    while (pendingMsgToServer.length > 0) {
      targetWs.send(pendingMsgToServer.shift());
    }
  });
  targetWs.on('error', (err) => {
    console.log('socket error', err);
  });
  targetWs.on('close', () => {
    console.log('socket close');
  });

  targetWs.on('message', (msg2) => {
    ws.send(msg2);
  });
});

/**
 * http://127.0.0.1:8000/ws/1665154822948?folder=/home/lighthouse/.ssh
 *
 * /ws/e72c6b029f08a2f1ca927edf6732e8ee/ 视为rootPath替换为/，进行转发代理
 */
router.all('*', (req, res) => {
  const proxyKey = req.url.match(/(?<=^\/)[\da-z]+/);
  let httpAgent;
  if (proxyKey) {
    httpAgent = codeServerProxifier.getProxy(proxyKey[0]);
    if (!httpAgent) {
      res.send('no agent');
      return;
    }
  }
  let url = req.url.replace(/^\/[\da-z]*/, '');
  const headers = req.headers;
  const bodyData = headers['content-type'] === 'application/x-www-form-urlencoded' ? querystring.stringify(req.body) : req.body;

  /**
   * 根据ID确定需要连接的httpAgent
   */
  axios({
    headers,
    baseURL: `http://${codeServerProxifier.url}`,
    method: req.method,
    url,
    data: bodyData,
    httpAgent,
    maxRedirects: 0,
    responseType: 'arraybuffer'
  }).then(response => {
    res.set(response.headers).status(response.status).send(response.data);
  }).catch(e => {
    const {response} = e;
    if (response) {
      res.set(response.headers).status(response.status);
      if (![204, 304].includes(response.status)) {
        res.send(response.data);
      }
    } else {
      console.log('Class: , Function: , Line 88, Param: ', e);
    }
  });
});

module.exports = router;
