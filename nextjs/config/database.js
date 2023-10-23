require('dotenv').config();

const configs = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
	  "port": process.env.DB_PORT,
    "host": "localhost",
    "dialect": "mysql",
    "migrationStorageTableSchema": "_sequelize"
  },
  "test": {
    "username": "docker",
    "password": "docker",
    "database": "nextjs_p_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "migrationStorageTableSchema": "_sequelize"
  },
  "production": {
    "username": "docker",
    "password": "docker",
    "database": "nextjs_p",
    "host": "localhost",
    "dialect": "mysql",
    "migrationStorageTableSchema": "_sequelize"
  }
};

const env = process.env.NODE_ENV || 'development';

module.exports = configs[env] || configs.development;

