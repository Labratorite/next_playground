'use strict';

import fs from 'fs';
import { Sequelize } from 'sequelize-typescript';

export { User } from './user.model';
export { Workflow } from './workflow.model';

import config from 'config/database';
import Seeders from '../seeders';

/*
const models = {
  'User': User,
  'Workflow': Workflow,
  'WorkflowNode': WorkflowNode,
  'WorkflowApprover': WorkflowApprover,
  'WorkflowNodeRelation': WorkflowNodeRelation
}
*/

const modelMatch = (filename, member) => {
  return (
    filename.substring(0, filename.indexOf('.model')).toLowerCase() ===
    member.toLowerCase()
  );
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    /* pathを利用してのloadが使えない
    models: [process.cwd() + '/db/models/*.model.ts'],
    modelMatch,
    */
    /* 個別に書けば行けるが動的ロードを試す。
    models: [User,  Workflow]
    */
  }
);

/**
 * 動的load
 * exportも動的にすることが可能だが、type保管が使えないのでexportは手動にする
 */
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

// this is private study project. basicly running on sqlite.
// it can remigration every time.
//https://sequelize.org/docs/v6/core-concepts/model-basics/
sequelize.sync().then(() => {
  Seeders(sequelize.getQueryInterface());
});

models.sequelize = sequelize;
module.exports = models; // export するinstanseとaddModelsしたinstanceが同じである必要がある

//export { sequelize };
