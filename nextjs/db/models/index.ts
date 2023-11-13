'use strict';

//import fs from 'fs';
/*
const Sequelize = require('sequelize-typescript');
const { User } = require('db/models/user.model');
const { Workflow } = require('db/models/workflow.model');
const { WorkflowNode } = require('db/models/WorkflowNode.model');
const { WorkflowApprover } = require('db/models/WorkflowApprover.model');
const { WorkflowNodeRelation } = require('db/models/WorkflowNodeRelation.model');

const config = require('config/database');
const Seeders = require('db/seeders');
const { GlobalRef } = require('lib/global-ref');
*/
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

declare global { var sequelize: Sequelize | undefined }  //eslint-disable-line no-var

/*
const modelMatch = (filename, member) => {
  return (
    filename.substring(0, filename.indexOf('.model')).toLowerCase() ===
    member.toLowerCase()
  );
};
*/

const initSequelize = () => {
  const options = {
    ...config,
    models: Object.values(models),
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
const beforeInit = !global.sequelize;
console.log('beforeInit0', beforeInit);

global.sequelize = global.sequelize || initSequelize();

if (!global.sequelize) {
  global.sequelize = initSequelize();

  // this is private study project. basicly running on sqlite.
  // it can remigration every time.
  //https://sequelize.org/docs/v6/core-concepts/model-basics/
  console.warn('init schema');
  global.sequelize.sync().then((_this) => {
    Seeders(_this.getQueryInterface());
  });
} else {
  global.sequelize.addModels(Object.values(models));
}
const sequelize = global.sequelize;


const initSchema = () => {
  if (!isInMemory) return;
  return global.sequelize?.sync().then((_this) => {
    Seeders(_this.getQueryInterface());
  });
};
if (isInMemory && beforeInit) {
  //暫定
  console.warn('init schema');
  initSchema();
}
/*
module.exports = {
  sequelize,
  initSchema,
  ...models, // export するinstanseとaddModelsしたinstanceが同じである必要がある
};
*/

//models.sequelize = sequelize;
//models.initSchema = initSchema;
//module.exports = models; // export するinstanseとsequelizeにaddModelsしたinstanceが同じである必要がある

export {
  sequelize,
  initSchema,
  User,
  Workflow,
  WorkflowNode,
  WorkflowApprover,
};
