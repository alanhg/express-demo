/**
 * 针对code-server-web进行iframe套娃，解决loading动画问题
 */
const express = require("express");
const {codeServerProxifier, CodeServerCheck} = require("../model/proxy");
const {SshClient} = require("../model/ssh");
const router = express.Router();


const connectOpts = {
  host: process.env.host, port: 22, username: process.env.username || 'root', password: process.env.password
};

router.get('/', (req, res) => {
  res.render('ide', {
    queryParams: new URLSearchParams(req.query)
  });
});

router.ws('/', (ws, req) => {
  ws.on('open', async () => {
    const client = new SshClient();
    client.connect(connectOpts);
    client.on('ready', async () => {
      const coderServerCheck = new CodeServerCheck(client);
      await coderServerCheck.start();
      ws.send(JSON.stringify({
        type: 'start-ide',
        status: 'ok'
      }));
    })
  })
});

module.exports = router;
