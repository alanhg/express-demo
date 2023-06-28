const Throttle = require('throttle');
const {Transform} = require('stream');
class ChunkSizeStream extends Transform {
  constructor(chunkSize, options) {
    super(options);
    this.chunkSize = chunkSize;
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk, encoding, callback) {
    this.buffer = Buffer.concat([this.buffer, chunk]);

    while (this.buffer.length >= this.chunkSize) {
      const chunkToPush = this.buffer.slice(0, this.chunkSize);
      this.push(chunkToPush);
      this.buffer = this.buffer.slice(this.chunkSize);
    }

    callback();
  }

  _flush(callback) {
    if (this.buffer.length > 0) {
      this.push(this.buffer);
    }
    callback();
  }
}

const downloadStream = new Throttle({bps: 1, highWaterMark: 2});
const chunkSizeStream = new ChunkSizeStream(2);

for (let i = 0; i < 10; i++) {
  downloadStream.write(i.toString());
}

downloadStream.pipe(chunkSizeStream).on('data', (chunk) => {
  console.log(chunk.toString());
});

