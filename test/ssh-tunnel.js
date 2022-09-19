const {Client} = require('ssh2');
const net = require("net");

/**
 * 希望于能够SSH联通目标机器，代理目标机器的某WEB服务，
 *
 * 存在多台目标机器时可以做到动态代理。
 *
 *
 * 内网穿透
 *
 *
 */
const conn = new Client();
// Send a raw HTTP request to port 80 on the server
conn.on('ready', () => {
  console.log('FIRST :: connection ready');

  net.createServer(function(sock) {
    // may want to sock.pause() first if on an older (pre-v0.10-ish?) node version
    conn.forwardOut('127.0.0.1', 8000, '127.0.0.1', 8000,  function(err, stream) {
      if (err) throw err; // do something better than this

      sock.pipe(stream);
      stream.pipe(sock);

      // sock.resume() here if you paused earlier
    });
  }).listen(8000);
}).connect({
  host: process.env.host, port: process.env.port, username: process.env.username, password: process.env.password
});



