/**
 * 聚焦WebShell相关功能调研
 */
const express = require("express");
const router = express.Router();
const SshFtpClient = require("../lib/ssh-ftp");
const SshClient = require("../lib/ssh");
const Stream = require("stream");
let logStartFlag = false;

router.ws('/ws/webshell', function (ws, res) {
  ws.send('logining\r');
  const sshClient = new SshClient();
  sshClient.connect(
    {
      host: process.env.host,
      port: 22,
      username: 'root',
      password: process.env.password
    }
  );
  sshClient.on('data', (data) => {
    ws.send(data);
    if (logStartFlag) {
      let fd = path.join(__dirname, '..', 'logs', 'ssh-log-record.log');
      if (fs.existsSync(fd)) {
        fs.appendFileSync(fd, data);
      }
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
    host: process.env.host,
    port: 22,
    username: 'root',
    password: process.env.password
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
          type: 'list',
          path: msg.path,
          data: res
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
  let fd = path.join(__dirname, '..', 'logs', 'ssh-log-record.log');
  if (logStartFlag) {
    if (fs.existsSync(fd)) {
      fs.unlink(fd, () => {
      });
    }
    fs.writeFileSync(fd, `[BEGIN] ${new Date().toLocaleString()}\n`);
  } else {
    fs.appendFileSync(fd, `\n[END] ${new Date().toLocaleString()}`);
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
