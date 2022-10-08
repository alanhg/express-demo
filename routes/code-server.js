/**
 * 针对code-server-web进行请求代理转发
 * @type {e | (() => Express)}
 */
const express = require("express");
const axios = require("axios");
const {codeServerProxifier} = require("../lib/code-server/code-server-proxy");
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
  const id = req.url.match(/(?<=^\/)\d+/);
  if (id) {
    httpAgent = codeServerProxifier.getProxy(id[0]);
    if (!httpAgent) {
      res.send('no agent');
      return;
    }
  }
  let url = req.url.replace(/^\/\d*/, '/');
  const headers = Object.keys(req.headers).reduce((h, key) => {
    h[key.toLowerCase()] = req.headers[key].replace(/127.0.0.1:8000(\/ws\/\d+)?/, codeServerProxifier.url);
    return h;
  }, {});

  const bodyData = Object.keys(req.body).reduce((h, key) => {
    if (!req.body[key]) {
      return h;
    }
    h[key] = req.body[key].replace(/127.0.0.1:8000(\/ws\/\d+)?/, codeServerProxifier.url);
    return h;
  }, {});

  /**
   * 根据ID确定需要连接的httpAgent
   */
  axios({
    headers, baseURL: `http://${codeServerProxifier.url}`, method: req.method, url, data: bodyData, httpAgent
  }).then(response => {
    res.set(response.headers);
    res.send(response.data);
  }).catch(e => {
    const {response} = e;
    console.error(e);

    if (response.status === 302) {
      debugger;
    }
    res.set(e.response.headers);
    res.send(e.response.data);
  });
});

router.ws('/:id/*', function (ws, res) {
  console.log(ws.url.replace(/^\/ws\/\d*/, '/'));
});

module.exports = router;
