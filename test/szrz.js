const {Base64} = require('js-base64');

let config = {username: 'root', host: '121.4.29.15'};

console.log(Base64.encode(config.host + config.username));
