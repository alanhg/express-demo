'use strict';

const path = require('path');
const {readFileSync} = require('fs');
const {Client} = require('ssh2');
// const ssh2Streams = require('ssh2-streams');
// const {KEX, CIPHER, SUPPORTED_SERVER_HOST_KEY} = ssh2Streams.constants.ALGORITHMS;
// const kex = KEX.concat(['diffie-hellman-group1-sha1']);
// const cipher = CIPHER.concat(['aes256-cbc', 'aes192-cbc', 'aes128-cbc']);

const config = {
  host: process.env.host,
  port: process.env.port, username: process.env.username, tryKeyboard: true, algorithms: {
    kex: ['curve25519-sha256', 'curve25519-sha256@libssh.org', 'ecdh-sha2-nistp256', 'ecdh-sha2-nistp384', 'ecdh-sha2-nistp521', // 'sntrup761x25519-sha512@openssh.com',
      'diffie-hellman-group-exchange-sha256', 'diffie-hellman-group16-sha512', 'diffie-hellman-group18-sha512', 'diffie-hellman-group14-sha256'],
    cipher: [// 'chacha20-poly1305@openssh.com',
      'aes128-ctr', 'aes192-ctr', 'aes256-ctr', // 'aes128-gcm@openssh.com',
      // 'aes256-gcm@openssh.com'
    ],
    serverHostKey: ['ssh-ed25519', // 'sk-ssh-ed25519@openssh.com',
      // 'ssh-rsa',
      'rsa-sha2-256', 'rsa-sha2-512', 'ssh-dss', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521', // 'sk-ecdsa-sha2-nistp256@openssh.com',
      // 'webauthn-sk-ecdsa-sha2-nistp256@openssh.com'
    ]
  }, password: process.env.password
};


const sshClient = new Client();

async function main() {
  sshClient.connect(config).on('error', (err) => {
    console.log(err);
  }).on('ready', () => {
    console.log('connected');
    sshClient.exec('/usr/bin/caddy start --config .term/code-server-run/caddy/Caddyfile\n', (err, stream) => {
      if (err) {
        console.error(err);
        throw err;
      }
      stream.on('close', (code, signal) => {
        // 如果正常结束，code为0，
        console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
        sshClient.end();
      }).on('data', (data) => {
        console.log('STDOUT: ' + data);
      }).stderr.on('data', (data) => {
        console.log('STDERR: ' + data);
        stream.close();
      });
    });
  });
}
  main().catch((e) => {
    console.error(e.message);
  });
