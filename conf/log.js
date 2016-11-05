/**
 * Created by He on 11/5/16.
 * 日志系统配置
 */
var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'console',//控制台输出
            category: "console"
        }, //控制台输出
        {
            type: "dateFile",//文件输出
            filename: 'server/logs/access.log',
            pattern: "-yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            category: 'access'
        }//日期文件格式
    ],
    replaceConsole: true,   //替换console.log
    // levels: {
    //     dateFileLog: 'INFO'
    // }
});

var dateFileLog = log4js.getLogger('access');

exports.logger = dateFileLog;

exports.use = function (app) {
    //页面请求日志,用auto的话,默认级别是WARN
    // app.use(log4js.connectLogger(dateFileLog, {level: 'auto', format: ':method :url'}));
    app.use(log4js.connectLogger(dateFileLog, {level: log4js.levels.INFO, format: ':method :url'}));
}