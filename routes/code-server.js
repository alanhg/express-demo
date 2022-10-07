/**
 * 针对code-server-web进行请求代理转发
 * @type {e | (() => Express)}
 */
const express = require("express");
const http = require("http");
const path = require("path");
const axios = require("axios");
const router = express.Router();

router.get('/:id', (req, res) => {
  let url = req.url.replace(/^\/\d*/, '/');
  console.log(url);
  url = 'http://localhost:8002' + url;
  http.get(url, (message) => {
    const {
      headers: {
        location
      }
    } = message;
    let redirectPath = path.join('/ws/', req.params.id, location);
    res.redirect(redirectPath);
  });
});

router.all('/:id/*', (req, res) => {
  let url = req.url.replace(/^\/\d*/, '');
  axios({
    // headers: req.headers,
    method: req.method, url: 'http://localhost:8002' + url, data: req.body,
  }).then(response => {
    res.set(response.headers);
    res.send(response.data);
  });
});

router.ws('/:id/*', function (ws, res) {
  console.log(ws.url.replace(/^\/ws\/\d*/, '/'));
});

module.exports = router;
