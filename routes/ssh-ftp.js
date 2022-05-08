const Client = require('ssh2-sftp-client');

class SshFtpClient {

  constructor(config) {
    this.config = config;
    this.sftpClient = new Client();
  }

  init() {
    return this.sftpClient.connect(this.config);
  }

  list(path) {
    return this.sftpClient.list(path);
  }
}

module.exports = SshFtpClient
