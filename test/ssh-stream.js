const szStart = 'rz\r**\x18B00000000000000\r';
const rzStart = 'rz waiting to receive.**';
const zEnd = '**\x18B0800000000022d\r';
const zAbort = '\x18\x18\x18\x18\x18';

const szStartBuffer = Buffer.from(szStart);

const zEndBuffer = Buffer.from(zEnd);
const rzStartBuffer = Buffer.from(rzStart);
const zAbortBuffer = Buffer.from(zAbort);

const Stream = require("stream");

let bufferLength = 5;
let offset = 0;

class Throttle extends Stream.Transform {
  _transform(buf, enc, next) {
    this.push(buf)
    next()
  }
}

const writableStream = new Throttle();

writableStream.on('data', data => {
  console.log(data.toString());
})

// 所有数据均已读完
writableStream.on('end', () => {
  console.log('🎉done');
})

let interval = setInterval(() => {
  // 接收前端binaryData
  const buf = Buffer.from(offset.toString(), "utf-8");
  writableStream.write(buf);
  offset = offset + buf.byteLength;
  if ((offset + buf.byteLength) > bufferLength) {
    clearInterval(interval);
    writableStream.end();
  }
}, 1000);

