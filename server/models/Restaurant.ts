import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Association,
  BelongsTo,
} from 'sequelize';
const Users = require("./Users")
type Users = InstanceType<typeof Users>;
const { sequelize } = require('./index')

interface RestaurantAttributes {
  id: number;
  baname: string | null;
  building_name: string | null;
  detail_address: string | null;
  entire_menus: string;
  exposure_menus: string;
  label: string;
  manager: number;
  sido: string | null;
  sigungu: string | null;
  zonecode: string | null;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Restaurant extends Model<RestaurantAttributes>
    implements RestaurantAttributes {
    public readonly id!: number;
    public baname!: string;
    public building_name!: string;
    public detail_address!: string;
    public entire_menus!: string;
    public exposure_menus!: string;
    public label!: string;
    public manager!: number;
    public sido!: string;
    public sigungu!: string;
    public zonecode!: string;

    public readonly createdAt!: Date;

    // public getScores!: HasManyGetAssociationsMixin<Scores>; 
    // public addScores!: HasManyAddAssociationMixin<Scores, number>;
    // public hasScores!: HasManyHasAssociationMixin<Scores, number>;
    // public countScores!: HasManyCountAssociationsMixin;
    // public createScores!: HasManyCreateAssociationMixin<Scores>;

    public static associate(models: any) {
      Restaurant.belongsTo(Users, {
        foreignKey: "user_id",
        as: 'mangerBelongsToUserId'
      });
    };
  }

  Restaurant.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      baname: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      building_name: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      detail_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      entire_menus: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      exposure_menus: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      label: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      manager: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      sido: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      sigungu: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      zonecode: {
        type: DataTypes.STRING(45),
        allowNull: true
      }
    },
    {
      modelName: 'Restaurant',
      tableName: 'restaurant',
      sequelize,
      freezeTableName: true,
      timestamps: true
    }
  )


}
