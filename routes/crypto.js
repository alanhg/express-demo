/**
 * 测试基于私钥导出公钥
 */
const forge = require('node-forge');
const fs = require('fs');
const crypto = require('crypto');
const {execSync} = require('child_process');
const sm3 = require('sm-crypto').sm3
const {Base64} = require('js-base64');
const {KEYUTIL, KJUR} = require("jsrsasign");
const buffer = require("buffer");
const Base58 = require("base-58")

// var pubHex = rs.KEYUTIL.getHexFro∂mPEM(pubPEM);
// var pubHex = rs..getHexFromPEM(a.asn1.x509.X509Util.getPKCS8PubKeyPEMfromRSAKey(prvKey));

const privateKeyPem = fs.readFileSync(`${__dirname}/client1.key`, {
  encoding: 'utf8'
});

const getPemBody = (pem) => {
  return pem.match(/(?<=KEY-----(\r\n))((.|\n|\r)+)(?=-----END)/g)[0];
}

(function loadPublicKeyFromPri() {
  const forgePriKey = forge.pki.privateKeyFromPem(privateKeyPem);
  const forgePubKey = forge.pki.setRsaPublicKey(forgePriKey.n, forgePriKey.e);
  const publicKeyPem = forge.pki.publicKeyToPem(forgePubKey);
  console.log('by node-forge');
  console.log(publicKeyPem);
})();

//
// (function () {
//   const pub = crypto.createPublicKey(privateKeyPem);
//   const pubstr = pub.export({
//     format: 'pem', type: 'spki'
//   })
//   console.log('by nodejs')
//   console.log(pubstr);
// })();

/**
 * OpenSSL等工具生成的PEM body会多一段，具体内容如下
 * MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
 */
(function createPublickKeyByPri() {
  console.log('by openssl')
  execSync(`openssl pkey -in ${__dirname}/client1.key -outform pem -pubout > ${__dirname}/client2.pem`, {stdio: 'inherit'})
  // execSync(`openssl pkey -in ${__dirname}/client1.key -outform pem –out > ${__dirname}/client1.pem`, {stdio: 'inherit'})
})();


// const hashData = sm3(.decode(()));
//
// function toHex(str) {
//   let result = '';
//   for (let i = 0; i < str.length; i++) {
//     result += str.charCodeAt(i).toString(16);
//   }
//   return result;
// }
//
// let str = hashData.substring(0, 20);

(function sha256Pem() {
  let pemStr = `MIIBCgKCAQEA6bYlyT3p2mieVwYsuNJSXJSrGUcyZQdU0EN3qcGkqssoNVkZz8km
eAYri0LH8EWPrQX8t67FlUsczChsmjK+tiBotxBZ18CFD47bDFjjOoAb4Qhhgyuc
JIFRGZNXLPl2yUBA3Hpn/J4Q02DpnH9t9zqCihS/f2Zt5o8G/ssgz/Wd7rMwQon2
MYceDa9Bla8mU1WA/dmDL/zKEekZvlxUWuhExdIERLE3RgxX1MXL4fCqO0x2ySkS
xxL5kKaHe7qHRkF1F7tswwwJN4w3TVOwlhjKnjR5zvw2tGOwaVfv5Ujym0bNfx6n
FGgGcz/s/LVc+KxYlQTSK4aLHSXwzxuOVwIDAQAB`
  // let pemStrDecoded = Base64.decode(pemStr);
  let buff = Buffer.from(pemStr, 'base64');
  // const md = new KJUR.crypto.MessageDigest({alg: "sha256"});
  // md.updateString(pemStrDecoded);
  // const mdHex = md.digest();
  // console.log('sha256', mdHex);

  const hash = crypto.createHash('sha256');
  hash.update(buff);
  let str = hash.digest('hex');
  console.log('sha256 address[nodejs]', str);
  const res = Base58.encode(Buffer.from(str, 'hex'));
  console.log('address[nodejs]', res);
})();

//
// (function getAddressFromPublicKey() {
//   const publicKey = '' + 'MIIBCgKCAQEA6bYlyT3p2mieVwYsuNJSXJSrGUcyZQdU0EN3qcGkqssoNVkZz8km\n' + 'eAYri0LH8EWPrQX8t67FlUsczChsmjK+tiBotxBZ18CFD47bDFjjOoAb4Qhhgyuc\n' + 'JIFRGZNXLPl2yUBA3Hpn/J4Q02DpnH9t9zqCihS/f2Zt5o8G/ssgz/Wd7rMwQon2\n' + 'MYceDa9Bla8mU1WA/dmDL/zKEekZvlxUWuhExdIERLE3RgxX1MXL4fCqO0x2ySkS\n' + 'xxL5kKaHe7qHRkF1F7tswwwJN4w3TVOwlhjKnjR5zvw2tGOwaVfv5Ujym0bNfx6n\n' + 'FGgGcz/s/LVc+KxYlQTSK4aLHSXwzxuOVwIDAQAB';
//   const md = new KJUR.crypto.MessageDigest({alg: "sha256"});
//   md.updateString(publicKey);
//   const mdHex = md.digest();
//   console.log('cal address', mdHex);
// })();
