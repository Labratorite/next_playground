'use strict';

import type { Optional } from 'sequelize';
import {
  Model,
  Column,
  DataType,
  Table,
  HasMany,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Workflow } from './workflow.model';
import { WorkflowApprover, WorkflowApproverCreationAttributes } from './WorkflowApprover.model';
import { Operators } from 'types/enum';

export interface WorkflowNodeAttributes {
  id: number;
  workflowId: number;
  operator?: Operator | null;
  nodeLv: number;
  isRoot: boolean;
  isReaf: boolean;
}

export interface WorkflowNodeCreationAttributes
  extends Optional<WorkflowNodeAttributes, 'id' | 'isRoot' | 'isReaf'> {
    approvers?: Omit<WorkflowApproverCreationAttributes, 'workflowNodeId'>[];
  }

@Table({
  timestamps: true,
  tableName: 'WorkflowNodes',
})
export class WorkflowNode extends Model<
  WorkflowNodeAttributes,
  WorkflowNodeCreationAttributes
> {
  @ForeignKey(() => Workflow)
  @Column({ onDelete: 'CASCADE' })
  workflowId!: number;

  @HasMany(() => WorkflowApprover)
  approvers?: WorkflowApprover[];

  @Column({ type: DataType.STRING, allowNull: true, values: [Operators.And, Operators.Or] })
  operator: Operator;

  @Column
  nodeLv!: number;

  //@Column({ defaultValue: false })
  //isRoot!: boolean;
  @Column({ type: DataType.VIRTUAL })
  get isRoot(): boolean {
    return 1 === this.getDataValue('nodeLv');
  }
  set isRoot(value) {
    throw new Error('Do not try to set the `isRoot` value!');
  }

  @Column({ defaultValue: false })
  isReaf!: boolean;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
