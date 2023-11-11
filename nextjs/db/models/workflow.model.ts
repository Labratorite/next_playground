'use strict';

import { Optional } from 'sequelize';
import {
  Model,
  Column,
  Table,
  HasMany,
  DeletedAt,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { WorkflowNode, WorkflowNodeCreationAttributes } from './WorkflowNode.model';

export interface WorkflowAttributes {
  id: number;
  name: string;
  description: string;
  publish: boolean;
}

export interface WorkflowCreationAttributes extends Optional<WorkflowAttributes, 'id'> {
  nodes?: WorkflowNodeCreationAttributes[];
}

@Table({
  timestamps: true,
  tableName: 'Workflows',
})
export class Workflow extends Model<WorkflowAttributes, WorkflowCreationAttributes> {
  @Column
  name!: string;

  @Column({ allowNull: true })
  description?: string;

  @Column({ defaultValue: false })
  publish!: boolean;

  @HasMany(() => WorkflowNode)
  nodes?: WorkflowNode[];

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @DeletedAt
  @Column
  deletedAt: Date;
}
