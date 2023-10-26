'use strict';

import {Model, Column, Table, HasMany, DeletedAt, CreatedAt, UpdatedAt} from "sequelize-typescript";
import { WorkflowNode } from "./WorkflowNode.model";

@Table({
  timestamps: true,
  tableName: "Workflows",
})
export class Workflow extends Model<Workflow> {
  @Column
  name!: string;

  @Column
  description?: string;

  @Column
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
