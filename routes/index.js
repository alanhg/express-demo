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

module.exports = router;