// const http = require('http');
const WebSocket = require('ws');

// http.get(
//   'http://127.0.0.1:8000/api/say-name?name=你好【 】我是xxx',
//   function (resMsg) {
//     let rawData = '';
//     resMsg.on('data', (chunk) => {
//       rawData += chunk;
//     });
//     resMsg.on('end', () => {
//       try {
//         const parsedData = JSON.parse(rawData);
//         console.log(parsedData);
//       } catch (e) {
//         console.error();
//       }
//     });
//   }
// );

const ws = new WebSocket(
  'ws://127.0.0.1:8000/encode-ws?name=你好 $$$$【 】我是xxx'
);

ws.on('open', function open() {
});
ws.on('error', console.error);
ws.on('message', function message(data) {
  console.log('received: %s', data);
});
