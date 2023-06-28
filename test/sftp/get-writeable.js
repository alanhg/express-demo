'use strict';

// Example of using a writeable with get to retrieve a file.
// This code will read the remote file, convert all characters to upper case
// and then save it to a local file

const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');

const config = {
  host: process.env.host,
  port: process.env.port || 22,
  username: process.env.username || 'root',
  password: process.env.password,
  keepaliveInterval: 30000,
  keepaliveCountMax: 200,
  readyTimeout: 60 * 1000,
};

const sftp = new Client();
const remoteFile = '/home/ubuntu/306医院就医记.md';

sftp
    .connect(config)
    .then(data => {
      let fileWtr = fs.createWriteStream(path.join(__dirname, 'local.md'));
      return sftp.get(remoteFile, fileWtr, {
        readStreamOptions: {
          start: 10,
        },
      });
    })
    .then(() => {
      return sftp.end();
    })
    .catch(err => {
      console.error(err.message);
    });
