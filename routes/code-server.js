/**
 * 针对code-server-web进行请求代理转发
 * @type {e | (() => Express)}
 */
const express = require("express");
const axios = require("axios");
const {codeServerProxifier} = require("../lib/code-server/code-server-proxy");
const querystring = require("querystring");
const router = express.Router();
let httpAgent;
/**
 * http://127.0.0.1:8000/ws/1665154822948?folder=/home/lighthouse/.ssh
 *
 * /ws/1665154822948视为rootPath替换为/，进行转发代理
 *
 * URL，请求头，请求体三部分需要处理下。
 * 响应头，响应体也需要处理下
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
  const headers = Object.keys(req.headers).reduce((h, key) => {
    h[key.toLowerCase()] = req.headers[key].replace(/127.0.0.1:8000(\/ws\/[\da-z]+)?/, codeServerProxifier.url);
    return h;
  }, {});

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
    console.error(e);
    res.set(response.headers).status(response.status).send(response.data);
  });
});

router.ws('*', function (ws, res) {
  console.log(ws.url.replace(/^\/ws\/\d*/, '/'));
});

module.exports = router;
