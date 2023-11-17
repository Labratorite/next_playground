'use strict';

import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { User } from './user.model';
import { Workflow } from './workflow.model';
import { WorkflowNode } from './WorkflowNode.model';
import { WorkflowApprover } from './WorkflowApprover.model';

import config from 'config/database';
import Seeders from '../seeders';

const models = {
  User,
  Workflow,
  WorkflowNode,
  WorkflowApprover,
};

type SequelizeSingleton = ReturnType<typeof initSequelize>

declare global {
  var sequelize: SequelizeSingleton | undefined; //eslint-disable-line no-var
}

function initSequelize() {
  const options = {
    ...config,
    //models: Object.values(models),
    /* pathを利用してのloadが使えない
      models: [process.cwd() + '/db/models/*.model.ts'],
      modelMatch,
      */
  } as SequelizeOptions;

  if ('database' in config) {
    return new Sequelize(config.database!, config.username!, config.password, options);
  }
  return new Sequelize(options);
};

/**
 * 動的load
 * exportも動的にすることが可能だが、type保管が使えないのでexportは手動にする
 */
/*
const models = {};
const cmd = process.cwd() + '/db/models';

const modelMatch = (filename, member) => {
  return (
    filename.substring(0, filename.indexOf('.model')).toLowerCase() ===
    member.toLowerCase()
  );
};

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

const isInMemory = config.storage === ':memory:';

function initSchema(){
  if (!isInMemory) return;
  console.warn('init schema');
  return global.sequelize?.sync().then((_this) => {
    Seeders(_this.getQueryInterface());
  });
};

if (!global.sequelize) {
  console.warn('global sequelize is not found');
} else {
  console.log('there is global sequelize');
}

const sequelize = global.sequelize || initSequelize();
sequelize.addModels(Object.values(models));

if (!global.sequelize) {
  global.sequelize = sequelize;

  // this is private study project. basicly running on sqlite.
  // it can remigration every time.
  //https://sequelize.org/docs/v6/core-concepts/model-basics/
  if (isInMemory) initSchema();
}

export {
  sequelize,
  initSchema,
  User,
  Workflow,
  WorkflowNode,
  WorkflowApprover,
};
