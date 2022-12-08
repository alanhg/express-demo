const {codeServerProxyManager} = require("../lib/code-server/model/proxy");
codeServerProxyManager.createProxy({
  host: '', port: 22, username: 'lighthouse', password: ''
}).on('ready', () => {

  console.log('connected1',);

});


codeServerProxyManager.createProxy({
  host: '', port: 22, username: 'lighthouse', password: ''
}).on('ready', () => {

  console.log('connected2',);

});
