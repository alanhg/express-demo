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

let httpAgent;

router.ws('*', function (ws, req) {
  console.log('Class: , Function: , Line 16, Param: ', req.url);
  const id = req.url.match(/(?<=^\/)[\da-z]+/);
  const path = req.url.replace(/(\/)[\da-z]+/, '');
  let targetWs;
  const headers = req.headers;
  if (id) {
    httpAgent = codeServerProxifier.getProxy(id[0]);
    if (!httpAgent) {
      return;
    }
    targetWs = new WebSocket(`ws://${codeServerProxifier.url}${path}`, {
      agent: httpAgent, headers
    });
  }
  targetWs.on('open', () => {
    ws.on('message', function (msg) {
      targetWs.send(msg);
    });
  });
  targetWs.on('error', function (err) {
    console.log('socket error', err);
  });
  targetWs.on('close', function () {
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
  const id = req.url.match(/(?<=^\/)[\da-z]+/);
  if (id) {
    httpAgent = codeServerProxifier.getProxy(id[0]);
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
    maxRedirects: 0
  }).then(response => {
    res.set(response.headers).status(response.status).send(response.data);
  }).catch(e => {
    const {response} = e;
    res.set(response.headers).status(response.status).send(response.data);
  });
});

module.exports = router;

function processHeaders(headers) {
  return Object.keys(headers).reduce((h, key) => {
    h[key.toLowerCase()] = headers[key].replace(/127.0.0.1:8000(\/ws\/[\da-z]+)?/, codeServerProxifier.url);
    return h;
  }, {});
}