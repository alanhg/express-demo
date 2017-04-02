/**
 * Created by He on 11/5/16.
 * 后端入口文件
 */

const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const redisClient = require('./conf/redisClient');
const path = require('path');
const routes = require('./routes/index');

app.set('trust proxy', 1); // trust first proxy
app.use(cookieParser());
app.use(session({
    // store: redisClient,
    secret: 'express-demo',
    saveUninitialized: true,
    resave: false
}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
// mount the router on the app
app.use('/', routes);
app.use('/', express.static(path.join(__dirname, '/static')));

// var log = require('./conf/log');
// log.use(app);
// respond with "hello world" when a GET request is made to the homepage

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});