'use strict';

const path = require('path');
const {readFileSync} = require('fs');
const {Client} = require('ssh2');
let privateKey = readFileSync(path.join(process.env.HOME, '.ssh/alan_home.cer'));
// const ssh2Streams = require('ssh2-streams');
// const {KEX, CIPHER, SUPPORTED_SERVER_HOST_KEY} = ssh2Streams.constants.ALGORITHMS;
// const kex = KEX.concat(['diffie-hellman-group1-sha1']);
// const cipher = CIPHER.concat(['aes256-cbc', 'aes192-cbc', 'aes128-cbc']);

const config = {
  host: process.env.ip,
  port: 22,
  username: 'ubuntu',
  tryKeyboard: true,
  algorithms: {
    kex:[
      'curve25519-sha256',
      'curve25519-sha256@libssh.org',
      'ecdh-sha2-nistp256',
      'ecdh-sha2-nistp384',
      'ecdh-sha2-nistp521',
      // 'sntrup761x25519-sha512@openssh.com',
      'diffie-hellman-group-exchange-sha256',
      'diffie-hellman-group16-sha512',
      'diffie-hellman-group18-sha512',
      'diffie-hellman-group14-sha256'
    ],
    cipher:[
      // 'chacha20-poly1305@openssh.com',
      'aes128-ctr',
      'aes192-ctr',
      'aes256-ctr',
      // 'aes128-gcm@openssh.com',
      // 'aes256-gcm@openssh.com'
    ],
    serverHostKey: [
      'ssh-ed25519',
      // 'sk-ssh-ed25519@openssh.com',
      // 'ssh-rsa',
      'rsa-sha2-256',
      'rsa-sha2-512',
      'ssh-dss',
      'ecdsa-sha2-nistp256',
      'ecdsa-sha2-nistp384',
      'ecdsa-sha2-nistp521',
      // 'sk-ecdsa-sha2-nistp256@openssh.com',
      // 'webauthn-sk-ecdsa-sha2-nistp256@openssh.com'
    ]
  },
  privateKey,
  debug: (s) => {
    console.log(s)
  }
};


const sshClient = new Client();

async function main() {
  sshClient.connect(config).on('error', (err) => {
    console.log(err);
  }).on('ready', () => {
    console.log('connected');
  });
}

main().catch((e) => {
  console.error(e.message);
});
