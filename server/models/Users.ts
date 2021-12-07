'use strict';
import {
  Model,
} from 'sequelize';
const bcrypt = require('bcrypt');
import {UsersAttributes} from "../interfaces/IUser";

module.exports = (sequelize: any, DataTypes: any) => {
  class Users extends Model<UsersAttributes>
    implements UsersAttributes {
    public readonly id!: number;
    public login_id!: string;
    public password!: string;
    public name!: string;
    public phone!: string;
    public wrong_num: number;
    public nickname!: string;
    public profile_path!: string;
    // public license_id!: number;
    public type!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public validPassword: (password: any, hash: any) => Promise<any>;

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
      name: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING(15),
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
      profile_path: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, 'a');
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, 'a');
            user.password = bcrypt.hashSync(user.password, salt);
          }
        }
      },
    }
  )
   Users.prototype.validPassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
   }

  return Users;
}
