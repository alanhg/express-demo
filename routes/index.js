/**
 * Created by He on 11/5/16.
 */
var express = require('express');
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
    res.cookie('name', 'tobi', {domain: 'localhost'})
    res.render('index');
});

module.exports = router;
