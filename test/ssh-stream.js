const szStart = 'rz\r**\x18B00000000000000\r';
const rzStart = 'rz waiting to receive.**';
const zEnd = '**\x18B0800000000022d\r';
const zAbort = '\x18\x18\x18\x18\x18';

const BSON = require('bson');
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
  console.log('---');
  console.log(data.toString());
  console.log('---');
})

// 所有数据均已读完
writableStream.on('end', () => {
  console.log('🎉done');
})

// let interval = setInterval(() => {
//   // 接收前端binaryData
//   const buf = Buffer.from(offset.toString(), "utf-8");
//   // writableStream.write(Buffer.from([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]));
//   offset = offset + buf.byteLength;
//   if ((offset + buf.byteLength) > bufferLength) {
//     clearInterval(interval);
//     writableStream.end();
//   }
// }, 1000);
const dataStr = BSON.serialize({a: Buffer.from('112323')});
const dataParsed = BSON.deserialize(dataStr);
console.log('Class: , Function: , Line 51, Param: ', dataParsed.a.buffer);

writableStream.write(dataParsed.a.buffer);

let uploadStream = null;

const client = {
  connect: () => {
    setTimeout(() => {
      uploadStream.write(Buffer.from(Math.random().toString()));
      uploadStream.on('data', (buf) => {
        console.log(buf.byteLength);
      })
    }, 3000);
  }, upload: () => {
    uploadStream = new Throttle();
    // const res = uploadStream.write(Buffer.from(Math.random().toString()));
    const res = uploadStream.write(Buffer.from([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]));
    console.log('Class: client, Function: upload, Line 61, Param: res', res);

    uploadStream.on('data', (buf) => {
      console.log(buf.toString());
    })
  }
}

// client.connect();
client.upload();

const input = 'drwxr-xr-x 3 root root 4096 Jun 05 22:01 .local';


const owner = input ? input.match(/(\d+\s)(\S+)/)[0].replace(/\d+\s/, '') : '';

console.log(owner);


let data1 = JSON.stringify({a: [104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]});
console.log(data1);

console.log('Class: , Function: , Line 91, Param: ', Buffer.from(JSON.parse(data1).a).toString());

