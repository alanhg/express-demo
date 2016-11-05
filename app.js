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
// var log = require('./conf/log');
// log.use(app);
// respond with "hello world" when a GET request is made to the homepage
app.use(function (req, res, next) {
    if (!req.session) {
        return next(new Error('oh no')) // handle error
    }
    next(); // otherwise continue
});
app.get('/', function (req, res) {
    res.send(req.sessionID);
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});