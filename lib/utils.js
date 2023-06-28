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

const formatTime = (time) => {
  if(time === 0) return '0s';
  const TIME_UINT = {
    hour: 'h',
    minute: 'min',
    second: 's',
  };
  const s = time % 60;
  const m = Math.floor(time / 60) % 60;
  const h = Math.floor(time / 60 / 60) % 60;

  let result = '';
  if (h > 0) {
    result += `${h}${TIME_UINT.hour}`;
  }
  if (m > 0 || (h > 0 && s > 0)) {
    result += `${m}${TIME_UINT.minute}`;
  }
  if (s > 0 || (m === 0 && h === 0)) {
    result += `${s < 1 ? 1 : s}${TIME_UINT.second}`;
  }
  return result;
};


/**
 * 定长随机
 */
const randomString = function (len) {
  len = len || 32;
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

module.exports = {
  aesDecrypt,
  aesEncrypt,
  formatTime,
  randomString
};