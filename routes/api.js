/**
 * API路由模块
 * @type {*|createApplication}
 */
const express = require('express');
const router = express.Router();
const config = require('../config');
const Base64 = require('js-base64').Base64;
// const jwt = require('jsonwebtoken');
// const token = require('../config/plugin/token');
const unlessPath = [{url: '/api/login', methods: ['POST']}];

const fs = require('fs');

// router.use(
//     token.validToken.unless(unlessPath),
//     token.noAuthorization,
//     token.checkRedis.unless(unlessPath)
// );
router.put('/a', function (req, res) {
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.status(405).json({
        value: 'forbid'
    });
})
router.get('/a', function (req, res) {
    res.json({
        value: 1
    });
});

router.post('/a', function (req, res) {
    res.json({
        value: 'ok'
    });
});

router.delete('/a', function (req, res) {
    res.json({
        value: 'ok'
    });
});


router.get('/b', function (req, res) {
    res.send({value: 2});
});
router.get('/protected',
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

router.get('/tips',
    function (req, res) {
        res.json([req.query.q, ["firefox", "first choice", "mozilla firefox"]]);
    }
);

/**
 * 登录
 */
router.post('/login',
    function (req, res) {
        console.log(req.headers);
        let rememberMe = req.body['rememberMe'];
        const authToken = rememberMe ? jwt.sign({username: req.body.username}, config.server.secret, {expiresIn: config.ttl.rememberMe}) : jwt.sign({username: req.body.username}, config.server.secret);
        token.add(authToken);
        return res.json({token: authToken});
    }
);

/**
 * 退出
 */
router.get('/logout', function (req, res) {
    const tok = token.getToken(req);
    token.remove(req);
    res.json('successful');
});

router.get("/hello", function (req, res, next) {
    if (req.query.name) {
        return res.json("hello");
    } else {
        next(new Error("没有name"));
    }
});


router.post("/upload-file", function (req, res) {
    const buff = new Buffer(req.body.file, 'base64');
    fs.writeFileSync(`./test.${req.body.fileType === 'zip' ? 'zip' : 'sol'}`, buff);
    res.json("success");
});

module.exports = router;
