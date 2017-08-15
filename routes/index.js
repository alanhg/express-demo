/**
 * Created by He on 11/5/16.
 */
var express = require('express');
var router = express.Router();
var conf = require('../conf');
var jwt = require('express-jwt');
const JWT_SECERT = 'alan-secret';
router.use(function (req, res, next) {
    if (!req.session) {
        return next(new Error('oh no')); // handle error
    }
    next(); // otherwise continue
});
router.get('/', function (req, res) {
    var parser = require('ua-parser-js');
    var ua = parser(req.headers['user-agent']);
    res.render('index', {ua: ua});
});

const testRouter = require('./test');
router.use('/test', testRouter);

router.get('/protected',
    jwt({secret: conf.secret}),
    function (req, res) {
        if (!req.user.admin) return res.sendStatus(401);
        res.sendStatus(200);
    });

router.get('/token',
    function (req, res) {
        res.json({
            token: jwt({secret: new Buffer(conf.secret, 'base64')})
        });
    }
);
var crypto = require('crypto');
router.get('/crypto',
    function (req, res) {
        const secret = 'abcdefg';
        var cipher = crypto.createCipher('aes-256-cbc', 'testkey');
        var text = JSON.stringify({
            username: 'staffchina',
            password: 'pass#123kland',
            appid: '824228206'
        });
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        console.log('加密后的文本：' + crypted);
        res.send(crypted);
    }
);
router.get('/decrypto',
    function (req, res) {
        var crypted = req.query.crypted;
        var decipher = crypto.createDecipher('aes-256-cbc', 'testkey');
        var dec = decipher.update(crypted, 'hex', 'utf8');
        dec += decipher.final('utf8');
        console.log('解密的文本：' + dec);
        res.send(dec);
    }
);

//发令牌
//令牌校验


module.exports = router;