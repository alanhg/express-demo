/**
 * 聚焦WebShell相关功能调研
 */
const express = require("express");
const router = express.Router();
const SshClient = require("../lib/webshell-ssh");
const ShellLog = require("../lib/shell-log");
const ideRouter = require('../lib/code-server/route/ide');
const codeServerProxyRouter = require('../lib/code-server/model/tty-route');
const SftpClient = require("../lib/sftp-client");
const {connectOpts} = require("../constants/config");

let logStartFlag = false;
let shellLog;

/**
 *  通过WebSocket连接目标机器
 */
router.ws('/ws/webshell', function (ws, res) {
  ws.send('logining\r');
  const sshClient = new SshClient(ws);
  sshClient.on('data', (data) => {
    if (logStartFlag) {
      shellLog.appendData(data);
    }
  });
  sshClient.on('close', (e) => {
  });
});

/**
 * 通过WebSocket连接目标机器，SFTP服务
 */
router.ws('/ws/sftp', function (ws, req) {
   new SftpClient(ws);
});

/**
 * SSH2终端日志记录
 */
router.get('/ssh2-log', (req, res) => {
  logStartFlag = req.query.start === 'true';
  if (logStartFlag) {
    shellLog = new ShellLog({timestamp: req.query.recordTimestamp === 'true'})
    shellLog.start();
    res.json({
      status: 'ok'
    });
  } else {
    shellLog.done(() => {
      res.json({
        status: 'ok'
      });
    });
  }
});

/**
 * 指定目标机器的CodeServer,修改URL，调整为访问目标服务器的URL
 * 需要代理HTTP/WS
 */
router.use('/tty', codeServerProxyRouter);
router.use('/ide', ideRouter);

router.connectOpts = connectOpts;
module.exports = router;

