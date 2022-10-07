/**
 * 针对code-server-web进行请求代理转发
 * @type {e | (() => Express)}
 */
const express = require("express");
const axios = require("axios");
const router = express.Router();

/**
 * http://127.0.0.1:8000/ws/1665154822948?folder=/home/lighthouse/.ssh
 *
 * /ws/1665154822948视为rootPath替换为/，进行转发代理
 */
router.all('/:id/?*', (req, res) => {
  let url = req.url.replace(/^\/\d*/, '');
  const headers = Object.keys(req.headers).reduce((h, key) => {
    h[key.toLowerCase()] = req.headers[key].replace(/127.0.0.1:8000(\/ws\/\d+)?/, 'localhost:8002');
    return h;
  }, {});
  const bodyData = Object.keys(req.body).reduce((h, key) => {
    if (!req.body[key]) {
      return h;
    }
    h[key] = req.body[key].replace(/127.0.0.1:8000(\/ws\/\d+)?/, 'localhost:8002');
    return h;
  }, {});
  axios({
    headers, baseURL: 'http://localhost:8002', method: req.method, url, data: bodyData,
  }).then(response => {
    res.set(response.headers);
    res.send(response.data);
  }).catch(e => {
    console.error(e);
    res.set(e.response.headers);
    res.send(e.response.data);
  });
});

router.ws('/:id/*', function (ws, res) {
  console.log(ws.url.replace(/^\/ws\/\d*/, '/'));
});

module.exports = router;
