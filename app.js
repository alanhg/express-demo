/**
 * Created by He on 11/5/16.
 * 后端入口文件
 */
const express = require('express');
const app = express();
const conf = require('./config');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

app.set('trust proxy', 1); // trust first proxy
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json()); // for parsing application/json

// mount the router on the app
app.use('/', routes);
app.use('/', express.static(path.join(__dirname, '/static')));

// var log = require('./config/log');
// log.use(app);
// respond with "hello world" when a GET request is made to the homepage

app.listen(conf.server.port, function () {
    console.log(`Example app listening on port ${conf.server.port}!`);
});
