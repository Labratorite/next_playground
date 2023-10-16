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
import {Model, Column, Table, BelongsToMany, CreatedAt, UpdatedAt} from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "Users",
})
export class User extends Model<User> {
  /*
  @Column
  first_name!: string;

  @Column
  last_name!: string;

  @Column
  email!: string;

  @Column
  birthday?: Date;

  @BelongsToMany(() => Movie, () => MovieActor)
  movies?: Movie[];

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;
*/
}
