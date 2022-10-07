/**
 * 聚焦WebShell相关功能调研
 */
const express = require("express");
const router = express.Router();
const SshFtpClient = require("../lib/ssh-ftp");
const SshClient = require("../lib/webshell-ssh");
const ShellLog = require("../lib/shell-log");
const Stream = require("stream");
const {codeServerProxifier} = require("../lib/code-server/code-server-proxy");
const codeServerProxyRouter = require('./code-server');

// const SshProxyClient = require("../lib/ssh-proxy");
// const CodeServerProxy = require("../lib/code-server-proxy");
let logStartFlag = false;
let shellLog;

const connectOpts = {
  host: process.env.host, port: 22, username: process.env.username || 'root', password: process.env.password
};

router.ws('/ws/webshell', function (ws, res) {
  ws.send('logining\r');
  const sshClient = new SshClient(ws);
  sshClient.connect(connectOpts);

  sshClient.on('data', (data) => {
    if (logStartFlag) {
      shellLog.appendData(data);
    }
  });
  sshClient.on('close', (e) => {
  });
});

router.ws('/ws/sftp', function (ws, res) {
  const sshClient = new SshFtpClient();
  sshClient.connect(connectOpts);
  sshClient.on('connected', () => {
    ws.send(JSON.stringify({
      type: 'connected'
    }));
  });
  ws.on('message', function (msg) {
    const options = JSON.parse(msg);
    if (options.type === 'list') {
      sshClient.list(options.path).then(res => {
        ws.send(JSON.stringify({
          type: 'list', path: options.path, data: res
        }))
      })
    }
    if (options.type === 'get-file') {
      const dst = new Throttle();
      sshClient.get(options.path, dst);
      dst.on('data', (chunk) => {
        ws.send(chunk);
      })
    }

    if (options.type === 'download-file') {
      const dst = new Throttle();
      sshClient.get(options.path, dst);
      dst.on('data', (chunk) => {
        ws.send(chunk);
      })
    }

    if (options.type === 'put-file') {
      const readerStream = Stream.Readable.from([options.data]);
      try {
        sshClient.put(readerStream, options.path).then(res => {
          ws.send(JSON.stringify({
            type: 'put-file', path: options.path,
          }))
        }).catch(e => {
          console.error(e);
        }).finally(() => {
        })
      } catch (e) {
      }
    }
  });
});

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

router.use('/ws',codeServerProxyRouter)

module.exports = router;

class Throttle extends Stream.Transform {
  _transform(buf, enc, next) {
    this.push(buf)
    next()
  }
}

