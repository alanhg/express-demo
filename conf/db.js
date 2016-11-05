/**
 * Created by He on 11/5/16.
 * mysql-db数据库配置
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'express_demo'
});
exports = connection;