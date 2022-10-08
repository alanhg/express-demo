const axios = require("axios");
var querystring = require('querystring');

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

axios({
  baseURL: 'http://localhost:8002', url: '/login', method: 'post', headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }, maxRedirects: 0,
  data: querystring.stringify(obj),
}).then(response => {
  console.log(response.status);
  console.log(response.data);
}).catch(e => {
  console.log(e.response.status);
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
