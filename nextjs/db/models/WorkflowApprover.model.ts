'use strict';

import { Optional } from 'sequelize';
import {
  Model,
  Column,
  Table,
  BelongsTo,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Workflow } from './workflow.model';
import { WorkflowNode } from './WorkflowNode.model';

export interface WorkflowApproverAttributes {
  id: number;
  workflowId: number;
  workflowNodeId: number;
  approverId: number;
  orderNo: number;
}

export interface WorkflowApproverCreationAttributes
  extends Optional<WorkflowApproverAttributes, 'id'> {}

@Table({
  timestamps: true,
  tableName: 'WorkflowApprovers',
})
export class WorkflowApprover extends Model<
  WorkflowApproverAttributes,
  WorkflowApproverCreationAttributes
> {
  @ForeignKey(() => Workflow)
  @Column({ onDelete: 'CASCADE' })
  workflowId!: number;

  @ForeignKey(() => WorkflowNode)
  @Column({ onDelete: 'CASCADE' })
  workflowNodeId!: number;

  @Column
  orderNo!: number;

  @ForeignKey(() => User)
  @Column
  approverId!: number;

  @BelongsTo(() => User, {foreignKey: 'approverId'})
  approver!: User;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
