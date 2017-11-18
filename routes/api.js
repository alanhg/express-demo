/**
 * API路由模块
 * @type {*|createApplication}
 */
const express = require('express');
const router = express.Router();
const conf = require('../conf');
const jwt = require('express-jwt');
const JWT_SECERT = 'alan-secret';
const Base64 = require('js-base64').Base64;


router.get('/a', function (req, res) {
    res.send({value: 1});
});
router.get('/b', function (req, res) {
    res.send({value: 2});
});
router.get('/protected',
    jwt({secret: conf.secret}),
    function (req, res) {
        if (!req.user.admin) return res.sendStatus(401);
        res.sendStatus(200);
    });

router.use('/token', function (req, res) {
        res.json({a: 1});
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
        res.send(Base64.encode(crypted));
    }
);
router.get('/decrypto',
    function (req, res) {
        var crypted = Base64.decode(req.query.crypted);
        var decipher = crypto.createDecipher('aes-256-cbc', 'testkey');
        var dec = decipher.update(crypted, 'hex', 'utf8');
        dec += decipher.final('utf8');
        console.log('解密的文本：' + dec);
        res.send(dec);
    }
);

router.get('/encodeURI',
    function (req, res) {
        var str = 'http://law.wkinfo.com.cn/legislation';
        res.redirect(str);
        // res.send(encodeURI(str));
    }
);
module.exports = router;