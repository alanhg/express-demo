/**
 * Created by He on 11/5/16.
 */
var express = require('express');
var WebSocket = require('ws');
var router = express.Router();

const testRouter = require('./test');
router.use('/test', testRouter);


const apiRouter = require('./api');
router.use('/api', apiRouter);

const authRouter = require('./auth');
router.use('/auth', authRouter);
router.use(function (err, req, res, next) {
    res.json({
        message: err.message,
        error: {}
    });
});
router.get('/search', (req, res) => {
    res.render('search', {keyword: req.query.q});
});
router.get('/', (req, res) => {
    res.cookie('name', Math.random(), {domain: 'localhost'})
    res.render('index');
});


router.get('/ws', (req, res) => {
    const ws = new WebSocket(``, "rust");
    ws.addEventListener('open', function () {
        console.info('WebSocket connected');
        let json = JSON.stringify({
            Type: "PtyStart",
            Data: {
                SessionId: "1234",
                Cols: 100,
                Rows: 50,
            }
        });
        ws.send(json);
    })
    ws.addEventListener('message', function (event) {
        console.log('Message from server ', event.data)
    })
    res.render('index');
});


router.get('/xterm', (req, res) => {
    res.render('xterm');
});
module.exports = router;
