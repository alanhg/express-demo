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
    if (logStartFlag) {
      shellLog.appendData(data);
    }
  });
  sshClient.on('close', (e) => {
    debugger;
  });
  ws.on('message', function (msg) {
    const options = JSON.parse(msg);
    if (options.type === 'search') {
      let command = `ug -r '${options.data}' -n -k -I ${options.path} --ignore-files`;
      /**
       * @see https://www.runoob.com/linux/linux-comm-grep.html
       * -a 或 --text : 不要忽略二进制的数据。
       * -i 或 --ignore-case : 忽略字符大小写的差别。
       *
       */
      console.log(command);
      sshClient.execCommand(command).then(res => {
        ws.send(JSON.stringify({
          type: 'search', path: options.path, keyword: options.data, data: res.toString()
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

module.exports = router;

class Throttle extends Stream.Transform {
  _transform(buf, enc, next) {
    this.push(buf)
    next()
  }
}

const writableStream = new Throttle();
