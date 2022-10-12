const {codeServerProxifier} = require("../lib/code-server/model/proxy");
codeServerProxifier.createProxy({
  host: '', port: 22, username: 'lighthouse', password: ''
}).on('ready', () => {

  console.log('connected1',);

});


codeServerProxifier.createProxy({
  host: '', port: 22, username: 'lighthouse', password: ''
}).on('ready', () => {

  console.log('connected2',);

});
