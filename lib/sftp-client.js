const Stream = require("stream");
const {EventEmitter} = require("events");
const Client = require("ssh2-sftp-client");

class SftpClient extends EventEmitter {
  constructor(ws) {
    super();
    this.ws = ws;
    ws.on('message', async (msg) => {
      const options = JSON.parse(msg);
      if (options.type === 'list') {
        const res = await this.list(options.data.path);
        this.sendMessage('list', {
          path: options.path, data: res
        });
      }
      if (options.type === 'get-file') {
        const dst = new Throttle();
        this.get(options.data.path, dst);
        dst.on('data', (chunk) => {
          this.sendMessage(chunk);
        })
      }

      if (options.type === 'stat-file') {
        const res = await this.stat(options.data.path);
        this.sendMessage('stat-file', {
          path: options.path, data: res
        })
      }
      if (options.type === 'download-file') {
        const dst = new Throttle();
        this.get(options.data.path, dst);
        dst.on('data', (chunk) => {
          this.sendMessage(chunk);
        })
      }

      if (options.type === 'put-file') {
        const readerStream = Stream.Readable.from([options.data]);
        try {
          this.put(readerStream, options.path).then(res => {
            this.sendMessage('put-file', {
              path: options.path,
            });
          }).catch(e => {
            console.error(e);
          }).finally(() => {
          })
        } catch (e) {
        }
      }
    });
  }


  connect(connectOpts) {
    this.conn = new Client();
    this.conn.connect(connectOpts).catch(err => {
      console.log(`Error: ${err.message}`); // error message will include 'example-client'
    }).then(() => {
      this.sendMessage('connected')
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
   */
  stat(path) {
    return this.conn.stat(path);
  }
}

module.exports = SftpClient;


class Throttle extends Stream.Transform {
  _transform(buf, enc, next) {
    this.push(buf)
    next()
  }
}
