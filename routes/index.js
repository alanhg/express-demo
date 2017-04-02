/**
 * Created by He on 11/5/16.
 */
var express = require('express');
var router = express.Router();

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

module.exports = router;