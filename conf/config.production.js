const conf = {
    server: {
        port: 3001,
        secret: 'hello world'
    },
    redis: {
        port: 6379,
        host: '127.0.0.1',
        db: 0,
        expire: 60 * 60, // 1h
    },
    ttl:{
        rememberMe: '7d', // 记住我
    },
    a: 1,
    secret: 'alan',
};
module.exports = conf;