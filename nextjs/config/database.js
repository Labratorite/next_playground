require('dotenv').config();

const mysql = {
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "port": process.env.DB_PORT,
  "host": "localhost",
  "dialect": "mysql",
  "migrationStorageTableSchema": "_sequelize"
};

const sqlite = {
  "dialect": "sqlite",
  "storage": ":memory:",
};

const configs = {
  "development": {
    ...mysql,
  },
  "test": {
    ...sqlite,
  },
  "production": {
    ...sqlite,
  }
};

const env = process.env.NODE_ENV || 'development';

module.exports = configs[env] || configs.development;

