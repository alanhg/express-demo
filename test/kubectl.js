/**
 * 测试kubectl相关命令
 */

const TkeClient = require('../lib/tke-client');
const client = new TkeClient(process.env.tke_podname, process.env.tke_namespace);
console.log(client.list('/root'));