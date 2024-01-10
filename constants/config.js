const connectOpts = {
  host: process.env.host,
  port: process.env.port || 22,
  username: process.env.username || 'root',
  password: process.env.password,
  keepaliveInterval: 30000,
  keepaliveCountMax: 200,
  readyTimeout: 60 * 1000,
  _workingDirectory: '/home/ubuntu/123', // 默认打开路径，没有设定的话，则走服务器配置
  // debug: console.log
};

module.exports = {
  connectOpts
}
