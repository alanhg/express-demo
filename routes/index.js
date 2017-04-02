/**
 * Created by He on 11/5/16.
 */
var express = require('express');
var router = express.Router();
var db = require('../db/schema');

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
router.get('/db', function (req, res) {
    db.test(function (err, data) {
        res.send(data);
    });
});

module.exports = router;