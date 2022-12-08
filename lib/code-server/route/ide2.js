/**
 * 针对code-server-web进行iframe套娃，解决loading动画问题
 */
const express = require("express");
const {codeServerProxifier} = require("../model/proxy");
const router = express.Router();

router.get('/:proxyKey', (req, res) => {
  let proxyKey = req.params.proxyKey;
  let proxy = codeServerProxifier.getProxy(proxyKey);
  if (!proxy) {
    res.send('no agent');
    return;
  }
  res.render('ide2', {
    queryParams: new URLSearchParams(req.query),
    proxyKey,
    folder: req.query.folder,
    host: proxy.connectOpts.host,
    port: codeServerProxifier.port,
    username: process.env.username,
  });
});

module.exports = router;
