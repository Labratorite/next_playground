'use strict';

import { Optional } from 'sequelize';
import {
  Model,
  Column,
  DataType,
  Table,
  DeletedAt,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

export interface Userttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  fullName: string;
}

export interface UserCreationAttributes extends Optional<Userttributes, 'id' | 'fullName'> {}

@Table({
  timestamps: true,
  tableName: 'Users',
})
export class User extends Model<Userttributes, UserCreationAttributes> {
  @Column
  firstName!: string;

  @Column
  lastName!: string;

  @Column
  email!: string;

  @Column
  nickname!: string;

  @Column({ type: DataType.VIRTUAL })
  get fullName(): string {
    return `${this.getDataValue('lastName')} ${this.getDataValue('firstName')}`;
  }
  /*
  @Column
  birthday?: Date;

  @BelongsToMany(() => Movie, () => MovieActor)
  movies?: Movie[];
  */
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
