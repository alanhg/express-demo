/**
 * Created by He on 4/2/17.
 * 测试路由模块
 */
const express = require('express');
const router = express.Router();
const db = require('../db/schema');
const fs = require('fs');
const path = require('path');
const Base64 = require('js-base64').Base64;
let conf = require('../config');

const superagent = require('superagent');
const {utils} = require("@stacker/alfred-utils");

router.get('/css', function (req, res, next) {
    const items = utils.filterItemsBy([{
        title: 'hello',
        subtitle: ''
    }], 'hel', 'title');
    utils.outputScriptFilter({items, rerun: 1});
    res.json({items});
});

router.get('/db', function (req, res) {
    db.test(function (err, data) {
        res.send(data);
    });
});

router.get('/read', function (req, res) {
    console.log(__dirname);
    fs.readFile(path.join(__dirname, '../static/file/groups.json'), function (err, data) {
        try {
            let rs = JSON.parse(data);//wk推荐配置
            // console.log(rs);
            for (let group in rs) {
                for (let item of rs[group]) {
                    console.log(Base64.decode(item['TEXT']));
                }
            }
            res.render('read', {data: rs, Base64: Base64});
        } catch (e) {
            console.log(e);
            res.render('read', {data: [], Base64: Base64});
        }
    });

});

router.get('/a', function (req, res) {
    res.send({value: conf.a});
});
router.get('/b', function (req, res) {
    res.send({value: conf.a});
});
router.get('/c', function (req, res) {
    let conf2 = require('../conf');
    return res.send({value: conf2.a});
    console.log('hello');
});


router.get('/promise', function (req, res) {
    var val = 1;

// 我们假设step1, step2, step3都是ajax调用后端或者是
// 在Node.js上查询数据库的异步操作
// 每个步骤都有对应的失败和成功处理回调
// 需求是这样，step1、step2、step3必须按顺序执行
    function step1(resolve, reject) {
        console.log('步骤一：执行');
        if (val >= 1) {
            resolve('Hello I am No.1');
        } else if (val === 0) {
            reject(val);
        }
    }

    function step2(resolve, reject) {
        console.log('步骤二：执行');
        if (val === 1) {
            resolve('Hello I am No.2');
        } else if (val === 0) {
            reject(val);
        }
    }

    function step3(resolve, reject) {
        console.log('步骤三：执行');
        if (val === 1) {
            resolve('Hello I am No.3');
        } else if (val === 0) {
            reject(val);
        }
    }

    new Promise(step1).then(function (val) {
        console.info(val);
        return new Promise(step2);
    }).then(function (val) {
        console.info(val);
        return new Promise(step3);
    }).then(function (val) {
        console.info(val);
        return val;
    });
    return res.send({value: 'hello world'});
});


router.get('/superagent', (req, res) => {
    const getBaidu = () => {
        return new Promise((resolve, reject) => {
            superagent
                .get('https://www.baidu.com/')
                .end((err, res) => {
                    // console.log(res);
                    if (err) reject(err);
                    resolve(res.text);
                });
        })
    };
    const getSina = () => {
        return new Promise((resolve, reject) => {
            superagent
                .get('http://www.sina.com.cn/')
                .end((err, res) => {
                    // console.log(res);
                    if (err) reject(err);
                    resolve(res.text);
                });
        });
    };
    getBaidu().then((body) => {
        console.log('百度内容');
        // console.log(body);
        return getSina();
    }).then((body) => {
        console.log('新浪内容');
        // console.log(body);
    })
});
router.param('id', function (req, res, next, id) {
    console.log('CALLED ONLY ONCE');
    next();
});

router.get('/user/:id', function (req, res, next) {
    console.log('although this matches');
    res.json('hello');
    console.log('不执行');
    next();
});

router.get('/user/:id', function (req, res) {
    console.log('and this matches too');
    res.json('world');
    // res.end();
});

router.head('/file', function (req, res) {
    res.json('world');
});

// promiseChain
router.get('/promiseChain', function (req, res) {
    var firstMethod = function () {
        return new Promise(function (resolve, reject) {
            console.log('first method completed');
            reject({data: 'firstMethod-ERROR'});
        });
    };


    var secondMethod = function (someStuff) {
        return new Promise(function (resolve, reject) {
            console.log('second method completed');
            resolve({data: "secondMethod-ERROR"});
        });
    };

    var thirdMethod = function (someStuff) {
        return new Promise(function (resolve, reject) {
            console.log('third method completed');
            resolve({data: "thirdMethod-ERROR"});
        });
    };

    firstMethod()
        .then(secondMethod).then(thirdMethod).catch((res) => {
        console.log("catch");
        console.log(res);
    });
    res.json("helo");
});

router.get('/download', function (req, res) {
    const currentPath = process.cwd();
    res.download(`${currentPath}/static/file/test.zip`, 'test.zip');
});


// 等价res.download
router.get('/download-binary', function (req, res) {
    const currentPath = process.cwd();
    const file = fs.readFileSync(`${currentPath}/static/file/test.zip`, 'binary');
    res.setHeader('Content-Length', file.length);
    res.setHeader('Content-Type', 'application/zip');
    res.write(file, 'binary');
});

router.get('/download-base64', function (req, res) {
    const currentPath = process.cwd();
    const content = fs.readFileSync(`${currentPath}/static/file/test.zip`, 'base64');
    res.json({content});
});

//
router.get('/download-str', function (req, res) {
    const currentPath = process.cwd();
    const file = fs.readFileSync(`${currentPath}/static/file/test.zip`, 'binary');
    res.setHeader('Content-Length', file.length);
    res.send(file);
});

module.exports = router;
