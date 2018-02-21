/**
 * Created by He on 11/5/16.
 * 后端入口文件
 */
const express = require('express');
const app = express();
const conf = require('./conf');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes/index');
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
require('./conf').a = 1111;

app.set('trust proxy', 1); // trust first proxy
app.use(cookieParser());
app.use(session({
    secret: 'express-demo',
    saveUninitialized: true,
    resave: false
}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json()); // for parsing application/json


app.use('/api', jwt({
    secret: '1111',
    getToken: function fromHeaderOrQuerystring(req) {
        console.log('执行');
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}));

// mount the router on the app
app.use('/', routes);
app.use('/', express.static(path.join(__dirname, '/static')));

// var log = require('./conf/log');
// log.use(app);
// respond with "hello world" when a GET request is made to the homepage

app.listen(conf.server.port, function () {
    console.log(`Example app listening on port ${conf.server.port}!`);
});