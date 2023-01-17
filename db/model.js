const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');
/**
 * 针对SSH代理访问CodeServer
 * @type {ModelCtor<Model>}
 */
const CodeServerDB = sequelize.define('CodeServerProxy', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  proxyKey: DataTypes.STRING,
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
});

module.exports = {
  CodeServerDB
}