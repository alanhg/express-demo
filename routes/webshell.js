const express = require("express");
const router = express.Router();
const EventEmitter = require("events");
const {Client} = require("./ssh2");
const SshFtpClient = require("./ssh-ftp");
let logStartFlag = false;

router.ws('/ws/webshell', function (ws, res) {
  ws.send('\r\nlogining\n\r');
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
  // sshClient.connect({
  //   host: process.env.host,
  //   port: 22,
  //   username: 'root',
  //   password: process.env.password
  // });
  ws.on('message', function (msg) {
    const options = JSON.parse(msg);
    if (options.type === 'list') {
      // sshClient.list(`grep ${options.data} -r .`).then(res => {
      //   console.log(res.toString());
      //   ws.send(JSON.stringify({
      //     type: 'list', data: res.toString()
      //   }));
      // });
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


class SshClient extends EventEmitter {
  constructor() {
    super();
    this.conn = new Client();
  }

  connect(config) {
    this.config = config;
    this.conn.connect(config);
    this.conn.on('ready', () => {
      this.conn.shell((err, s) => {
        if (err) throw err;
        this.stream = s;
        this.stream.on('close', () => {
          console.log('Stream :: close');
          // this.conn.end();
        }).on('data', (data) => {
          this.emit('data', data);
        });
      });
    });
  }

  execCommand(command) {
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) {
          console.log('SECOND :: exec error: ' + err);
          this.conn.end();
          return reject();
        }
        stream.on('close', () => {
          this.conn.end(); // close parent (and this) connection
        }).on('data', (data) => {
          resolve(data);
        });
      })
    })
  }

  write(data) {
    this.stream && this.stream.write(data);
  }
}


class SftpClient extends EventEmitter {
  constructor() {
    super();
    this.conn = new Client();
  }

  connect() {
    this.conn.connect({
      host: process.env.host, port: 22, username: 'root', password: process.env.password
    })
    this.conn.on('ready', () => {
      this.conn.shell((err, s) => {
        if (err) throw err;
        this.stream = s;
        this.stream.on('close', () => {
          console.log('Stream :: close');
          // this.conn.end();
        }).on('data', (data) => {
          this.emit('data', data);
        });
      });
    });
  }

  execCommand(command) {
    return new Promise((resolve, reject) => {
      this.conn.exec(command, (err, stream) => {
        if (err) {
          console.log('SECOND :: exec error: ' + err);
          this.conn.end();
          return reject();
        }
        stream.on('close', () => {
          this.conn.end(); // close parent (and this) connection
        }).on('data', (data) => {
          resolve(data);
        });
      })
    })
  }

  write(data) {
    this.stream && this.stream.write(data);
  }
}


module.exports = router;
