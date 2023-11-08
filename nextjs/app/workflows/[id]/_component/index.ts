import type { User as UserModel } from '@models';
import { Operators } from 'types/enum';

export type Node = {
  id?: number;
  nodeLv: number;
  operator: Operator;
  isRoot?: boolean;
  isReaf?: boolean;
  approvers: Approver[];
};
export type Approver = {
  id?: number;
  orderNo: number;
  approver: User;
};
export type User = Required<Pick<UserModel, 'id' | 'nickname'>>;

export type WorkflowNodeForm = {
  nodes: Node[];
};

export const demoData: Node[] = [
  {
    id: 1,
    //uid: 1,
    nodeLv: 1,
    operator: Operators.Or,
    isRoot: true,
    approvers: [
      {
        id: 101,
        //uid: 101,
        orderNo: 1,
        approver: { nickname: 'Jack', id: 1 },
      },
      {
        id: 102,
        //uid: 102,
        orderNo: 2,
        approver: { nickname: 'Bob', id: 2 },
      },
    ],
  },
  {
    id: 2,
    //uid: 2,
    nodeLv: 2,
    operator: Operators.And,
    isReaf: true,
    approvers: [
      {
        id: 103,
        //uid: 103,
        orderNo: 1,
        approver: { nickname: 'Jesse', id: 4 },
      },
    ],
  },
];
