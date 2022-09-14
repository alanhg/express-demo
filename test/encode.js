/**
 * 测试基于私钥导出公钥
 */

const szStart = Buffer.from('rz\r**\x18B00000000000000\r');
const szStart2 = Buffer.from('rz\r**B00000000000000\r');
//
// console.log(szStart.toString() === szStart2.toString());
//
// const BSON = require('bson');
//
// console.log(typeof BSON.serialize({a: 1, b: 'username'}));
// console.log(BSON.deserialize(JSON.stringify({a: 1, b: 'username'})),);

const moment = require('moment');
const date = moment("2014-02-27T10:00:00").format('DD-MM-YYYY');
console.log(date);
