import { Model } from "sequelize-typescript";
import { Operators } from './enum';

/*
declare interface Operators {
  And: 'and',
  Or: 'or'
};
*/

export {}

declare global {
  type ReadonlyModel<T extends Model> = T & Required<Pick<T, 'id'>>;

  type Operator = typeof Operators[keyof typeof Operators];
}
