/**
 * Created by He on 11/5/16.
 */
var express = require('express');
var WebSocket = require('ws');
var fs = require('fs');
var router = express.Router();
var pty = require('node-pty');

const testRouter = require('./test');
router.use('/test', testRouter);
const {Client} = require('ssh2');

const apiRouter = require('./api');

const authRouter = require('./auth');
const path = require("path");

var terminals = {}, logs = {}, stream, logStartFlag = false;

router.use('/api', apiRouter);
router.use('/auth', authRouter);
router.use(function (err, req, res, next) {
  res.json({
    message: err.message, error: {}
  });
});
router.get('/search', (req, res) => {
  res.render('search', {keyword: req.query.q});
});
router.get('/', (req, res) => {
  res.cookie('name', Math.random(), {domain: 'localhost'})
  res.render('index');
});


router.get('/ws', (req, res) => {
  const ws = new WebSocket(``, "rust");
  ws.addEventListener('open', function () {
    console.info('WebSocket connected');
    let json = JSON.stringify({
      Type: "PtyStart", Data: {
        SessionId: "1234", Cols: 100, Rows: 50,
      }
    });
    ws.send(json);
  })
  ws.addEventListener('message', function (event) {
    console.log('Message from server ', event.data)
  })
  res.render('index');
});


router.get('/xterm', (req, res) => {
  res.render('xterm');
});


router.get('/shortcuts', (req, res) => {
  res.render('shortcuts');
});

router.post('/xterm', (req, res) => {
  let shell = 'zsh';// zsh,bash
  var cols = parseInt(req.query.cols), rows = parseInt(req.query.rows),
    term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : shell, [], {
      encoding: null, name: 'xterm-color', cols: cols || 80, rows: rows || 24, cwd: process.env.PWD + '/_cache', // // 首次进入系统目录
      env: process.env
    });

  console.log('Created terminal with PID: ' + term.pid);
  terminals[term.pid] = term;
  res.send(term.pid.toString());
  res.end();
});


router.post('/xterm/:pid/size', function (req, res) {
  var pid = parseInt(req.params.pid), cols = parseInt(req.query.cols), rows = parseInt(req.query.rows),
    term = terminals[pid];

  term.resize(cols, rows);
  console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
  res.end();
});


router.get('/xterm-ssh2', (req, res) => {
  res.render('xterm-ssh2');
});

router.ws('/ws/webshell', function (ws, res) {
  ws.send('\r\nlogining\n\r');
  const conn = new Client();
  conn.on('ready', () => {
    conn.shell((err, s) => {
      if (err) throw err;
      stream = s;
      stream.on('close', () => {
        console.log('Stream :: close');
        conn.end();
      }).on('data', (data) => {
        ws.send(data);
        if (logStartFlag) {
          let fd = path.join(__dirname, '..', 'logs', 'ssh-log-record.log');
          if (fs.existsSync(fd)) {
            fs.appendFileSync(fd, data);
          }
        }
      });
    });
  }).connect({
    host: process.env.host, port: 22, username: 'root', password: process.env.password
  });
  ws.on('message', function (msg) {
      stream && stream.write(msg);
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

router.ws('/xterm/:pid', (ws, req) => {
  var term = terminals[parseInt(req.params.pid)];
  ws.send(logs[term.pid]);

  term.on('data', function (data) {
    try {
      ws.send(data);
    } catch (ex) {
      // The WebSocket is not open, ignore
    }
  });
  ws.on('message', function (msg) {
    term.write(msg);
  });
  ws.on('close', function () {
    term.kill();
    console.log('Closed terminal ' + term.pid);
    // Clean things up
    delete terminals[term.pid];
    delete logs[term.pid];
  });
});

module.exports = router;
