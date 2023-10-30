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

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    models: Object.values(models),
    /* pathを利用してのloadが使えない
    models: [process.cwd() + '/db/models/*.model.ts'],
    modelMatch,
    */
    /* 個別に書けば行けるが動的ロードを試す。
    models: [User,  Workflow]
    */
   /*
   hooks: {
    afterDefine: (model) => {
      console.log('afterDefine', model);
      model.sync();
    },
   }
   */
   logging: true,
  },
);

// A hook that is run after Sequelize() call
/*
sequelize.afterInit((seq) => {
  console.log('afterInit');
  console.log('afterInit: ', seq);

})
*/
/*
sequelize.addHook('afterInit', (seq) => {
  // Do stuff
  console.log('afterInit');
  console.log('afterInit: ', seq);
});
*/
/**
 * A hook that is run after a connection is established
 * https://sequelize.org/docs/v6/other-topics/hooks/#connection-hooks

sequelize.beforeConnect((connection, options) => {
  console.log('afterConnect');
  console.log('afterConnect: ', connection);
  console.log('afterConnect:options', options);
});
 */

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

// this is private study project. basicly running on sqlite.
// it can remigration every time.
//https://sequelize.org/docs/v6/core-concepts/model-basics/
const initSchema = () => {
  return sequelize.sync().then((_this) => {
    Seeders(_this.getQueryInterface());
  });
};

if (process.env.USE_IN_MEMORY_STORAGE === "true") {
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
//module.exports = models; // export するinstanseとaddModelsしたinstanceが同じである必要がある
export {
  sequelize,
  initSchema,
  User,
  Workflow,
};
