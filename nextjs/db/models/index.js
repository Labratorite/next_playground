'use strict';

//import fs from 'fs';
import { Sequelize } from 'sequelize-typescript';

import { User } from './user.model';
import { Workflow } from './workflow.model';

import config from 'config/database';
import Seeders from '../seeders';

const models = {
  User,
  Workflow,
}

/*
const modelMatch = (filename, member) => {
  return (
    filename.substring(0, filename.indexOf('.model')).toLowerCase() ===
    member.toLowerCase()
  );
};
*/

const initSequelize = () => {
  return new Sequelize(config.database, config.username, config.password, {
    ...config,
    models: Object.values(models),
    /* pathを利用してのloadが使えない
      models: [process.cwd() + '/db/models/*.model.ts'],
      modelMatch,
      */
    logging: true,
  });
};

/**
 * 動的load
 * exportも動的にすることが可能だが、type保管が使えないのでexportは手動にする
 */
/*
const models = {};
const cmd = process.cwd() + '/db/models';

fs.readdirSync(cmd)
  .filter((file) => file.endsWith('.model.ts'))
  .forEach((file) => {
    //const model = sequelize['import'](path.join(cmd, file));
    //db[model.name] = model;
    let model = require(`@models/${file}`);

    for (const [key, value] of Object.entries(model)) {
      if (modelMatch(file, key)) {
        models[key] = value;
        break;
      }
    }
  });

sequelize.addModels(Object.values(models));
*/

const beforeInit = !global.sequelize;
console.log('beforeInit0', beforeInit);

global.sequelize = global.sequelize || initSequelize();

if (!global.sequelize) {
  global.sequelize = initSequelize();
} else {
  global.sequelize.addModels(Object.values(models));
}

const initSchema = () => {
  if (process.env.USE_IN_MEMORY_STORAGE !== 'true' || !beforeInit) return;

  return global.sequelize.sync().then((_this) => {
    Seeders(_this.getQueryInterface());
  });
};

// this is private study project. basicly running on sqlite.
// it can remigration every time.
//https://sequelize.org/docs/v6/core-concepts/model-basics/
if (process.env.USE_IN_MEMORY_STORAGE === 'true' && beforeInit) {
  console.warn('init schema');
  initSchema();
}

export {
  initSchema,
  User,
  Workflow,
};
