/**
 * Created by He on 11/5/16.
 * redis-session存储配置
 */
var session = require('express-session');//session会话
var RedisStore = require('connect-redis')(session);
var options = {
    port: 6379,
    host: "127.0.0.1",
    db: 0,
    pass: '',
    // ttl: 60 * 60 * 24 * 30,   //Session的有效期为30天
};

var redisClient = new RedisStore(options); // replace with your config

redisClient.on('error', function (err) {
    console.log('Redis error: ' + err);
});

module.exports = redisClient;