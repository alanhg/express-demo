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
const apiRouter = require('./api');
const authRouter = require('./auth');
const webShellRouter = require('./webshell');
const path = require("path");
var terminals = {}, logs = {};

router.use('/', webShellRouter);
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
  res.cookie('name', Math.random(), {domain: 'localhost'});
  const views = fs.readdirSync(path.join(__dirname, '../views'));
  res.render('index', {
    views: views.map(item => item.replace(/\.[^.]+$/, ''))
  });
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

router.get('/home', (req, res) => {
  res.render('home');
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
