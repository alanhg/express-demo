const axios = require("axios");
var querystring = require('querystring');
const WebSocket = require("ws");
const {codeServerProxyManager} = require("../lib/code-server/model/proxy");
const path = require("path");
const fs = require("fs");

// axios({
//   url: 'http://localhost:8002', maxRedirects: 0
// }).then(response => {
//   console.log(response.status);
// }).catch(e => {
//   console.log(e.response.status);
// });

let obj = {
  base: '.', href: 'http://localhost:8002/login', password: '1b4cae37fa18eac9384af396'
};

// axios({
//   baseURL: 'http://localhost:8002', url: '/login', method: 'post', headers: {
//     "Content-Type": "application/x-www-form-urlencoded"
//   }, maxRedirects: 0,
//   data: querystring.stringify(obj),
// }).then(response => {
//   console.log(response.status);
//   console.log(response.data);
// }).catch(e => {
//   console.log(e.response.status);
// });

//
// const targetWs = new WebSocket(`ws://127.0.0.1:8002/stable-74b1f979648cc44d385a2286793c226e611f59e7?reconnectionToken=32b52a08-155c-4ab9-866a-3d7e770c754a&reconnection=false&skipWebSocketFrames=false`, [], {
//   headers: {
//     'Accept-Encoding': 'gzip, deflate, br',
//     'Accept-Language': 'en-US,en;q=0.9',
//     'Cache-Control': 'no-cache',
//     Connection: 'Upgrade',
//     Cookie: 'code-server-session=%24argon2id%24v%3D19%24m%3D4096%2Ct%3D3%2Cp%3D1%24pD1qEB30OTMyNPBnuRdwKg%24je0n1egEOmsFygTpCk1BROtgIn%2BhN6XiDInAau7cyfc',
//     Host: 'localhost:8002',
//     Origin: 'http://localhost:8002',
//     Pragma: 'no-cache',
//     'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
//     'Sec-WebSocket-Key': 'Ivxk04U/FYM98Ovpwj8Y1Q==',
//     'Sec-WebSocket-Version': 13,
//     Upgrade: 'websocket',
//     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
//   }
// });
// targetWs.on('open', () => {
//   console.log('socket open');
// });
// targetWs.on('error', function (err) {
//   console.log('socket error', err);
// });
// targetWs.on('close', function () {
//   console.log('socket close');
// });
// targetWs.on('message', (msg2) => {
//   console.log('socket receive msg', msg2);
// });

//
// const http = require('http');
//
// // Setting the configuration for
// // the request
// const options = {
//   hostname: 'localhost',
//   port: 8002,
//   path: '/', method: 'GET'
// };
//
// // Sending the request
// http.request(options, (res) => {
//   let data = ''
//
//   res.on('data', (chunk) => {
//     data += chunk;
//   });
//
//   // Ending the response
//   res.on('end', () => {
//     console.log('Body:', data);
//     console.log(res.statusCode);
//   });
//
// }).on("error", (err) => {
//   console.log("Error: ", err)
// }).end()


axios({
  baseURL: 'http://localhost:8002',
  url: '/stable-74b1f979648cc44d385a2286793c226e611f59e7/static/out/vs/workbench/contrib/welcomeGettingStarted/common/media/dark.png',
  method: 'get',
  headers: {
    Cookie: 'code-server-session=%24argon2id%24v%3D19%24m%3D4096%2Ct%3D3%2Cp%3D1%24pD1qEB30OTMyNPBnuRdwKg%24je0n1egEOmsFygTpCk1BROtgIn%2BhN6XiDInAau7cyfc',
  },
  maxRedirects: 0,
  data: {},
  responseType: 'arraybuffer'
}).then(response => {
  console.log(response.data);
  fs.writeFileSync(path.join(__dirname, 'a.png'), response.data);
}).catch(e => {
  console.log(e);
});
