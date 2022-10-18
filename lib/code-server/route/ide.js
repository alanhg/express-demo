/**
 * 针对code-server-web进行iframe套娃，解决loading动画问题
 */
const express = require("express");
const {codeServerProxifier, CodeServerCheck, CodeServerCommands} = require("../model/proxy");
const {SshClient} = require("../model/ssh");
const chalk = require("chalk");
const router = express.Router();

const connectOpts = {
  host: process.env.host, port: 22, username: process.env.username || 'root', password: process.env.password
};

router.get('/', (req, res) => {
  let proxyKey = codeServerProxifier.buildProxyKey(connectOpts);
  if (!codeServerProxifier.getProxy(proxyKey)) {
    codeServerProxifier.createProxy(connectOpts);
  }
  res.render('ide', {
    queryParams: new URLSearchParams(req.query), proxyKey, folder: req.query.folder
  });
});

/**
 * 自动关闭code-server-web，但考虑到多TAB，最佳方式应该是agent不active的时候再做这件事
 */
router.ws('/', (ws, req) => {
  const client = new SshClient();
  client.connect(connectOpts);
  client.on('ready', async () => {
    const coderServerCheck = new CodeServerCheck(client);
    const status = await coderServerCheck.start();
    client.disconnect();
    ws.send(JSON.stringify({
      type: 'start-ide', data: {
        status
      }
    }));
  });
  ws.on('close', (e) => {
    // const client = new SshClient();
    // client.connect(connectOpts);
    // client.on('ready', async () => {
    //   client.execCommandPromisefy(CodeServerCommands.stopService).then(() => {
    //     client.disconnect().on('close', () => {
    //       console.log(chalk.red('编辑器服务已关闭'));
    //     });
    //   });
    //   console.log(chalk.red('编辑器closed'));
    // });
  })
});

module.exports = router;
