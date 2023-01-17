const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');
/**
 * 多机器代理信息持久化管理
 */
const CodeServerDB = sequelize.define('CodeServerProxy', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  host: DataTypes.STRING,
  username: DataTypes.STRING,
  connectOpts: DataTypes.JSON,
  /**
   * 代理协议，ssh/http
   */
  proxyProtocol: DataTypes.STRING,
  /**
   * 连接数
   */
  connections: DataTypes.NUMBER,
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  camelCase: true,
});

module.exports = {
  CodeServerDB
}