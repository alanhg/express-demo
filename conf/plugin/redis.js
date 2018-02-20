/**
 * Created by He on 11/5/16.
 * redis-session存储配置
 */
const config = require('../index');
const redis = require("redis");

const options = {
    host: config.redis.host,
    port: config.redis.port,
    db: config.redis.db,
};

const redisClient = redis.createClient(options);

redisClient.on('error', function (err) {
    console.log('Redis error: ' + err);
});

module.exports = redisClient;