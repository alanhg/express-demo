const express = require('express');
const router = express.Router();
router.get('/a', function (req, res) {
    res.send({value: 1});
});
router.get('/b', function (req, res) {
    res.send({value: 2});
});
module.exports = router;