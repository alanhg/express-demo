var net = require('net');

var HOST = 'localhost';
var PORT = 4040;

var server = net.createServer();
server.listen(PORT, HOST);

server.on('connection', function (sock) {
  console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
  sock.write("TCP sending message : 1");
  console.log('Server listening on ' + server.address().address + ':' +
    server.address().port);
}).listen(PORT, HOST);
