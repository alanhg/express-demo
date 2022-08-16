const sm2 = require('sm-crypto').sm2

let keypair = sm2.generateKeyPairHex();

publicKey = keypair.publicKey // 公钥
privateKey = keypair.privateKey // 私钥

console.log(publicKey);
console.log(privateKey);

let verifyResult = sm2.verifyPublicKey(publicKey) // 验证公钥
