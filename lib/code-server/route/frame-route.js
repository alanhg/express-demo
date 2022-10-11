/**
 * 针对code-server-web进行iframe套娃，解决loading动画问题
 */
const express = require("express");
const {codeServerProxifier} = require("../model/proxy");
const router = express.Router();

router.get('/:proxyId', (req, res) => {
  const proxyId = req.params.proxyId
  if (proxyId) {
    let httpAgent = codeServerProxifier.getProxy(proxyId);
    if (httpAgent) {
      res.render('proxy', {
        proxyId: req.params.proxyId
      });
      return;
    }
  }
  res.send('no agent');
});

module.exports = router;
