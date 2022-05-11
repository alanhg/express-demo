const Client = require('ssh2-sftp-client');
const path = require('path');

class SshFtpClient {

  constructor(config) {
    this.config = config;
    this.sftpClient = new Client();
  }

  init() {
    return this.sftpClient.connect(this.config).catch(err => {
      console.log(`Error: ${err.message}`); // error message will include 'example-client'
    });
  }

  list(path) {
    return this.sftpClient.list(path);
  }

  downloadFile(filePath) {
    const filename = filePath.match(/(?<=\/)[\w.]+$/)[0];
    const localPath = path.join(__dirname, '..', '_cache', filename);
    return this.sftpClient.fastGet(filePath, localPath, {
      concurrency: 64, // integer. Number of concurrent reads to use
      chunkSize: 32768, // integer. Size of each read in bytes
      step: function (total_transferred, chunk, total) {
        console.log('download step', total_transferred, chunk, total, 'percent:', (total_transferred / total * 100).toFixed(0), '%');
      }
    })
  }
}

module.exports = SshFtpClient
