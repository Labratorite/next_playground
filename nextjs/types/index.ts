//import { Model } from "sequelize-typescript";
import { Operators } from './enum';

/*
declare interface Operators {
  And: 'and',
  Or: 'or'
};
*/

export {}

declare global {
  //type ReadonlyModel<T extends Model> = T & Required<Pick<T, 'id'>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type UndefinedOf<T extends Record<any, any>> = Partial<Record<keyof T, undefined>>;

  type Operator = typeof Operators[keyof typeof Operators];
}
