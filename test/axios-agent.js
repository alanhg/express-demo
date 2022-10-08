const axios = require("axios");
var querystring = require('querystring');
const WebSocket = require("ws");
const {codeServerProxifier} = require("../lib/code-server/code-server-proxy");

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


const targetWs = new WebSocket(`ws://127.0.0.1:8002/stable-74b1f979648cc44d385a2286793c226e611f59e7?reconnectionToken=32b52a08-155c-4ab9-866a-3d7e770c754a&reconnection=false&skipWebSocketFrames=false`, {});
targetWs.on('open', () => {
  console.log('socket open');
});
targetWs.on('error', function (err) {
  console.log('socket error', err);
});
targetWs.on('close', function () {
  console.log('socket close');
});
targetWs.on('message', (msg2) => {
  console.log('socket receive msg', msg2);
});

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

