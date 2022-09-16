const {Client} = require('ssh2');

const conn = new Client();
// Send a raw HTTP request to port 80 on the server
conn.on('ready', () => {
  console.log('FIRST :: connection ready');
  conn.forwardOut('127.0.0.1', 8000, '127.0.0.1', 8000, (err, stream) => {
    if (err) {
      console.log('FIRST :: forwardOut error: ' + err);
      return conn.end();
    }
  });
}).connect({
  host: process.env.host, port: process.env.port, username: process.env.username, password: process.env.password
});
