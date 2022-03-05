const forge = require('node-forge');
const fs = require('fs');


// var pubHex = rs.KEYUTIL.getHexFro∂mPEM(pubPEM);
// var pubHex = rs..getHexFromPEM(a.asn1.x509.X509Util.getPKCS8PubKeyPEMfromRSAKey(prvKey));

const privateKey = fs.readFileSync(`${__dirname}/client1.key`, {
  encoding: 'utf8'
});

const forgePriKey = forge.pki.privateKeyFromPem(privateKey);
const forgePubKey = forge.pki.setRsaPublicKey(forgePriKey.n, forgePriKey.e);
const publicKey = forge.pki.publicKeyToPem(forgePubKey);
console.log(publicKey);
