// buffer to base64 method in nodejs
function base64_encode(buffer) {
  return buffer.toString('base64');
}

// base64 to string method in nodejs
function base64_decode(base64str) {
    return Buffer.from(base64str, 'base64').toString();
}

console.log(base64_encode(Buffer.from('test1')));

console.log(base64_decode('dGVzdDE='));
