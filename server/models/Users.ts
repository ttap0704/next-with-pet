'use strict';
import {
  Model,
} from 'sequelize';

const { sequelize } = require('./index')

interface UsersAttributes {
  id: number;
  login_id: string;
  password: string | null;
  wrong_num: number;
  nickname: string;
  // license_id: number;
  type: boolean;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Users extends Model<UsersAttributes>
    implements UsersAttributes {
    public readonly id!: number;
    public login_id!: string;
    public password!: string;
    public wrong_num: number;
    public nickname!: string;
    // public license_id!: number;
    public type!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: any) {
      Users.hasMany(models.Restaurant, {
        sourceKey: "id",
        foreignKey: "manager",
      });
    };
  }

  Users.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      login_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      wrong_num: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        defaultValue: 0,
      },
      nickname: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: true
      },
      // license_id: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      type: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
    },
    {
      modelName: 'Users',
      tableName: 'users',
      sequelize,
      freezeTableName: true,
      timestamps: true,
    }
  )

  return Users;
}
