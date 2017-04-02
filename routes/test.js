/**
 * Created by He on 4/2/17.
 */
const express = require('express');
const router = express.Router();
const db = require('../db/schema');

router.get('/css', function (req, res, next) {
    res.render('css');
});

router.get('/db', function (req, res) {
    db.test(function (err, data) {
        res.send(data);
    });
});
module.exports = router;