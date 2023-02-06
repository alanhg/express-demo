const crypto = require('crypto');
const CRYPTO_SECRET='3jLt*RPj9_qQ37Zr3Thn';
function aesDecrypt(encrypted) {
  const decipher = crypto.createDecipher('aes192', CRYPTO_SECRET);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function aesEncrypt(data) {
  const cipher = crypto.createCipher('aes192', CRYPTO_SECRET);
  let crypted = cipher.update(data, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

module.exports = {
  aesDecrypt,
  aesEncrypt,
};