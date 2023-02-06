const crypto = require('crypto');
const CRYPTO_SECRET='pdE3LJ_12*pPAagvnu4aRftL'; // 必须24位

function aesDecrypt(encrypted) {
  const decipher = crypto.createDecipheriv('aes-192-cbc', CRYPTO_SECRET, Buffer.alloc(16, 0));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function aesEncrypt(data) {
  const cipher = crypto.createCipheriv('aes-192-cbc', CRYPTO_SECRET, Buffer.alloc(16, 0));
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

module.exports = {
  aesDecrypt,
  aesEncrypt,
};