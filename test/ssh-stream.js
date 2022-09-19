const szStart = 'rz\r**\x18B00000000000000\r';
const rzStart = 'rz waiting to receive.**';
const zEnd = '**\x18B0800000000022d\r';
const zAbort = '\x18\x18\x18\x18\x18';

const szStartBuffer = Buffer.from(szStart);

const zEndBuffer = Buffer.from(zEnd);
const rzStartBuffer = Buffer.from(rzStart);
const zAbortBuffer = Buffer.from(zAbort);

const Stream = require("stream");
const path = require("path");

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
  writableStream.write(Buffer.from([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]));
  offset = offset + buf.byteLength;
  if ((offset + buf.byteLength) > bufferLength) {
    clearInterval(interval);
    writableStream.end();
  }
}, 1000);


console.log('Class: , Function: , Line 49, Param: ', path.join('/a/', '/b'));
