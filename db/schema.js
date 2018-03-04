/**
 * Created by He on 11/5/16.
 * DB操作相关函数
 */
var mysql = require('mysql');
var dbConfig = require('../config/plugin/db');
var db = {};

db.connect = function () {
    var connection = mysql.createConnection(dbConfig);
    connection.connect(function (err) {
        if (err) {
            logger.error("DB connection error: " + err);
            return false;
        }
    });

    connection.on('close', function (err) {
        logger.error('mysqldb conn close');
    });

    connection.on('error', function (err) {
        logger.error('mysqldb error: ' + err);
    });

    return connection;

};
db.test = function (callback) {
    var connection = db.connect();
    connection.query('SELECT * FROM `user`', function (err, rows) {
        if (err)  callback(err, null);
        else
            callback(null, rows);
    });
    // connection.end();
};



module.exports = db;

