'use strict';
/*
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    / **
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     * /
    static associate(models) {
      // define association here
    }
  }
  User.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
  });
  return User;
};
*/
import {Model, Column, Table, DeletedAt, CreatedAt, UpdatedAt} from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "Users",
})
export class User extends Model<User> {
  @Column
  firstName!: string;

  @Column
  lastName!: string;

  @Column
  email!: string;

  @Column
  nickname!: string;
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
