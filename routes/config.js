const connectOpts = {
  host: process.env.host,
  port: process.env.port || 22,
  username: process.env.username || 'root',
  password: process.env.password,
  keepaliveInterval: 30000,
  keepaliveCountMax: 200,
  // debug: console.log
};

module.exports = {
  connectOpts
}
