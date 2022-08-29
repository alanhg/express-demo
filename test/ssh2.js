var stream = require('stream');
var util = require('util');
util.inherits(Duplexer, stream.Duplex);

function Duplexer(opt) {
  stream.Duplex.call(this, opt);
  this.data = [];
}

Duplexer.prototype._read = function readItem(size) {
  var chunk = this.data.shift();
  if (chunk == "stop") {
    this.push(null);
  } else {
    if (chunk) {
      this.push(chunk);
    }
  }
};
Duplexer.prototype._write = function (data, encoding, callback) {
  this.data.push(data);
  callback();
};
var d = new Duplexer({allowHalfOpen: true});
d.on('data', function (chunk) {
  console.log('read: ', chunk.toString());
});
d.on('readable', function () {
  console.log("readable");
})
d.on('end', function () {
  console.log('Message Complete');
});
d.write("I think, ");
d.write("therefore ");
d.write("I am.");
d.write("Rene Descartes");
d.write("stop");
