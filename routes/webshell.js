/**
 * 聚焦WebShell相关功能调研
 */
const express = require("express");
const router = express.Router();
const SshFtpClient = require("../lib/ssh-ftp");
const SshClient = require("../lib/ssh");
const ShellLog = require("../lib/shell-log");
const Stream = require("stream");
let logStartFlag = false;
let shellLog;

router.ws('/ws/webshell', function (ws, res) {
  ws.send('logining\r');
  const sshClient = new SshClient();
  sshClient.connect({
    host: process.env.host, port: 22, username: 'root', password: process.env.password
  });
  sshClient.on('data', (data) => {
    ws.send(data);
    console.log(data.toString());
    if (logStartFlag) {
      shellLog.appendData(data);
    }
  });
  ws.on('message', function (msg) {
    const options = JSON.parse(msg);
    if (options.type === 'search') {
      sshClient.execCommand(`grep ${options.data} -r .`).then(res => {
        console.log(res.toString());
        ws.send(JSON.stringify({
          type: 'search', data: res.toString()
        }));
      })
    } else {
      sshClient.write(options.data);
    }
  });
});

router.ws('/ws/sftp', function (ws, res) {
  const sshClient = new SshFtpClient();
  sshClient.connect({
    host: process.env.host, port: 22, username: 'root', password: process.env.password
  });
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
          type: 'list', path: msg.path, data: res
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
  });
});

router.get('/ssh2-log', (req, res) => {
  logStartFlag = req.query.start === 'true';
  shellLog = new ShellLog({timestamp: req.query.recordTimestamp === 'true'})
  if (logStartFlag) {
    shellLog.start();
  } else {
    shellLog.done();
  }
  res.json({
    status: 'ok'
  });
});

module.exports = router;

class Throttle extends Stream.Transform {
  _transform(buf, enc, next) {
    this.push(buf)
    next()
  }
}

const writableStream = new Throttle();
