/**
 * Created by He on 11/5/16.
 * 后端入口文件
 */

var express = require('express');
var app = express();
var session = require('express-session');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}))
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world');
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});