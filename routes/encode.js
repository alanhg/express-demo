/**
 * 测试基于私钥导出公钥
 */

const szStart = Buffer.from('rz\r**\x18B00000000000000\r');
const szStart2 = Buffer.from('rz\r**B00000000000000\r');

console.log(szStart.toString() === szStart2.toString());
