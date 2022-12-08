/**
 * Created by He on 11/5/16.
 * 后端入口文件
 */
const express = require('express');
const app = express();
require('express-ws')(app);
const conf = require('./config');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
var cors = require('cors');
const {codeServerProxyManager, codeServerProxy} = require("./lib/code-server/model/proxy");

app.set('trust proxy', 1); // trust first proxy
// app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
// mount the router on the app
app.use('/', routes);
app.use('/js', express.static(path.join(__dirname, '/node_modules')));
app.use('/logs', express.static(path.join(__dirname, '/logs')));
app.use('/', express.static(path.join(__dirname, '/static')));

// var log = require('./config/log');
// log.use(app);
// respond with "hello world" when a GET request is made to the homepage

const server = app.listen(conf.server.port, '0.0.0.0', function () {
  console.log(`Example app listening on port http://127.0.0.1:${conf.server.port}!`);
});

// server.on('upgrade', function (req, socket, head) {
//   if (req.baseUrl === '/tty') {
//     const proxyKey = req.originalUrl.split('/')[2];
//     console.log('req.url', req.url);
//     let httpAgent;
//     httpAgent = codeServerProxyManager.getProxy(proxyKey);
//     if (!httpAgent) {
//       return;
//     }
//
//     socket.on('error', err => {
//       console.error(err); // ECONNRESET will be caught here
//     });
//     codeServerProxy.ws(req, socket, head, {
//       target: httpAgent.url
//     });
//   }
// });
