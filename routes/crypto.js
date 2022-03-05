const forge = require('node-forge');
const fs = require('fs');
const crypto = require('crypto');


// var pubHex = rs.KEYUTIL.getHexFro∂mPEM(pubPEM);
// var pubHex = rs..getHexFromPEM(a.asn1.x509.X509Util.getPKCS8PubKeyPEMfromRSAKey(prvKey));

const privateKeyPem = fs.readFileSync(`${__dirname}/client1.key`, {
  encoding: 'utf8'
});

const forgePriKey = forge.pki.privateKeyFromPem(privateKeyPem);
const forgePubKey = forge.pki.setRsaPublicKey(forgePriKey.n, forgePriKey.e);
const publicKeyPem = forge.pki.publicKeyToPem(forgePubKey);
console.log(publicKeyPem);

(function () {
  const pub = crypto.createPublicKey(privateKeyPem);
  const pubstr = pub.export({
    format: 'pem',
    type: 'spki'
  })
  console.log('by nodejs')
  console.log(pubstr);
})();
