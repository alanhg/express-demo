const {codeServerProxifier} = require("../lib/code-server/code-server-proxy");
codeServerProxifier.connect({
  host: '', port: 22, username: 'lighthouse', password: ''
}).on('ready', () => {

  console.log('connected1',);

});


codeServerProxifier.connect({
  host: '', port: 22, username: 'lighthouse', password: ''
}).on('ready', () => {

  console.log('connected2',);

});