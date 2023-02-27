const {aesDecrypt, aesEncrypt} = require('../lib/utils');
const pt = require('path');
const fs = require('fs');
const https = require('https');
const encryptedMsg = aesEncrypt('123');
const msg = aesDecrypt(encryptedMsg);

console.log(encryptedMsg);
console.log(msg);

const pwaFile = pt.join(__dirname, 'pwa', 'a.txt');


async function main() {
  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(pwaFile);
    https.get(
        'https://1991421.cn',
        (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            // after download completed close filestream
            file.on('finish', () => {
              file.close();
              resolve();
            });
          } else {
            reject(new Error(`Failed to download file, status code: ${response.statusCode}`));
          }
        },
    );
  });
}

main();