const Stream = require('stream');
const {EventEmitter} = require('events');
const SftpClient = require('ssh2-sftp-client');
const {Client} = require('ssh2');

class WebSftpClient extends EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
    ws.on('message', async (msg) => {
      try {
        await this.handle(msg);
      } catch (e) {
        console.error(e);
      }
    });
  }


  async handle(msg) {
    const options = JSON.parse(msg);
    if (options.type === 'connect') {
      this.connect(options.data);
    } else if (options.type === 'list') {
      const res = await this.list(options.data.path);
      this.sendMessage('list', {
        path: options.data.path, data: res
      });
    } else if (options.type === 'get-file') {
      const dst = new Throttle();
      this.get(options.data.path, dst);
      dst.on('data', (chunk) => {
        this.sendMessage(chunk);
      })
    } else if (options.type === 'stat-file') {
      try {
        const res = await this.stat(options.data.path);
        this.sendMessage('stat-file', {
          path: options.path, data: res
        })
      } catch (e) {
        this.sendMessage('stat-file', {
          path: options.path, error: {
            code: e.code,
            message: e.message
          }
        })
      }
    } else if (options.type === 'download-file') {
      const dst = new Throttle();
      this.get(options.data.path, dst).catch(e => {
        this.sendMessage('download-file', {
          error: e
        });
      });
      dst.on('data', (chunk) => {
        this.sendMessage(chunk);
      })
    }

    /**
     * 上传/更新文件
     */
    else if (options.type === 'put-file') {
      const readerStream = Stream.Readable.from([options.data.data]);
      try {
        this.put(readerStream, options.data.path).then(res => {
          this.sendMessage('put-file', {
            path: options.path,
          });
        }).catch(e => {
          console.error(e);
        }).finally(() => {
        })
      } catch (e) {
      }
    } else if (options.type === 'cancel-file') {
      this.conn.end();
      this.conn.on('close', () => {
        this.connect(this.connectOpts);
      })
    }
  }

  connect(connectOpts) {
    this.connectOpts = connectOpts;
    const conn = new Client();

    conn.on('ready', () => {
      this.conn.client.subsys('sudo -u /usr/lib/openssh/sftp-server');
    }).connect(connectOpts);

    conn.on('subsystem', (accept, reject, info) => {
      if (info.subsystem === 'sftp') {
        if (err)
          conso.error(err);
        const channel = accept();
        const sftp = new SftpClient();
        sftp.sftp = channel;
        this.conn = sftp;
        this.sendMessage('connected')
      }
    });
  }

  sendMessage(typeOrBuf, data) {
    if (typeOrBuf instanceof Buffer) {
      this.ws.send(typeOrBuf);
    } else {
      this.ws.send(JSON.stringify({
        type: typeOrBuf, data
      }));
    }
  }

  list(path) {
    return this.conn.list(path);
  }

  get(path, dst) {
    return this.conn.get(path, dst);
  }

  put(dst, path) {
    return this.conn.put(dst, path);
  }

  /**
   * Returns the attributes associated with the object pointed to by path.
   *
   * let stats = {
   *   mode: 33279, // integer representing type and permissions
   *   uid: 1000, // user ID
   *   gid: 985, // group ID
   *   size: 5, // file size
   *   accessTime: 1566868566000, // Last access time. milliseconds
   *   modifyTime: 1566868566000, // last modify time. milliseconds
   *   isDirectory: false, // true if object is a directory
   *   isFile: true, // true if object is a file
   *   isBlockDevice: false, // true if object is a block device
   *   isCharacterDevice: false, // true if object is a character device
   *   isSymbolicLink: false, // true if object is a symbolic link
   *   isFIFO: false, // true if object is a FIFO
   *   isSocket: false // true if object is a socket
   * };
   *
   * 当前会消费的字段
   * size，isFile
   */
  stat(path) {
    return this.conn.stat(path);
  }
}

module.exports = WebSftpClient;


class Throttle extends Stream.Transform {
  _transform(buf, enc, next) {
    this.push(buf)
    next()
  }
}
