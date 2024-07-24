const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const dbConfig = config.database;

module.exports = {
  development: {
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.name,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect
  }
};