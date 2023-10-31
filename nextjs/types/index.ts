import { Operators } from './enum';

/*
declare interface Operators {
  And: 'and',
  Or: 'or'
};
*/

export {}

declare global {
  type Operator = typeof Operators[keyof typeof Operators];
}
