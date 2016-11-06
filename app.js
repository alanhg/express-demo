/**
 * Created by He on 11/5/16.
 * 后端入口文件
 */

var express = require('express');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var redisClient = require('./conf/redisClient');
app.set('trust proxy', 1); // trust first proxy
app.use(cookieParser());
app.use(session({
    store: redisClient,
    secret: 'express-demo',
    saveUninitialized: true,
    resave: false
}));
var routes = require('./routes/router');
// mount the router on the app
app.use('/', routes);
// var log = require('./conf/log');
// log.use(app);
// respond with "hello world" when a GET request is made to the homepage

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});