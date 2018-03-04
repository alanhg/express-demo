/**
 * Created by He on 19/07/2017.
 */
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const development = require('./config.development');
const production = require('./config.production');
const test = require('./config.test');
let config = null;
switch (env) {
    case 'development':
        config = development;
        break;
    case 'production':
        config = production;
        break;
    default:
        config = test;
}
module.exports = config;