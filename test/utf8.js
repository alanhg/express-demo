const {aesDecrypt, aesEncrypt} = require('../lib/utils');
const encryptedMsg = aesEncrypt('123');
const msg = aesDecrypt(encryptedMsg);

console.log(encryptedMsg);
console.log(msg);
