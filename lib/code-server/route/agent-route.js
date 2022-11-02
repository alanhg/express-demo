/**
 * 针对code-server-web进行请求代理转发，包含HTTP+WS两部分
 * @type {e | (() => Express)}
 */
const express = require("express");
const axios = require("axios");
const {codeServerProxifier} = require("../model/proxy");
const querystring = require("querystring");
const router = express.Router();
const WebSocket = require('ws');

router.ws('*', function (ws, req) {
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
  ws.on('message', function (msg) {
    if (targetWs.readyState !== 1) {
      pendingMsgToServer.push(msg);
    } else {
      targetWs.send(msg);
    }
  });

  ws.on('close', function (msg) {
  });
  targetWs.on('open', () => {
    while (pendingMsgToServer.length > 0) {
      targetWs.send(pendingMsgToServer.shift());
    }
    // console.log('httpAgent.freeSockets', httpAgent.freeSockets);
    // console.log('httpAgent.sockets', httpAgent.sockets);
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
    httpAgent = codeServerProxifier.getProxy(proxyKey[0]).agent;
    if (!httpAgent) {
      res.send('no agent');
      return;
    }
  }
  let url = req.url.replace(/^\/[\da-z]*/, '');
  const headers = req.headers;
  const bodyData = headers['content-type'] === 'application/x-www-form-urlencoded' ? querystring.stringify(req.body) : req.body;
  let retried = false;

  function sendRequest() {
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
      /**
       * 遇到该类报错，尝试重试一次
       * (SSH) Channel open failure: Connection refused
       */
      if (e.isAxiosError && e.reason === 2 && retried === false) {
        retried = true;
        sendRequest();
        return;
      }
      if (response) {
        res.set(response.headers)
          .status(response.status)
          .send(response.data);
      } else {
        console.log(e);
      }
    });
  }

  sendRequest();
});

module.exports = router;
