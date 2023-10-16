'use strict';

import { Sequelize } from 'sequelize-typescript';
import { User } from "./user.model";

import config from "config/database";

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  models: [User]
});

export { User, sequelize };
