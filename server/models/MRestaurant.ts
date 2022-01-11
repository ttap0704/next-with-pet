import {
  Model,
} from 'sequelize';

import {RestaurantAttributes} from "../interfaces/IRestaurant";

module.exports = (sequelize: any, DataTypes: any) => {
  class Restaurant extends Model<RestaurantAttributes>
    implements RestaurantAttributes {
    public readonly id!: number;
    public bname!: string;
    public building_name!: string;
    public detail_address!: string;
    public label!: string;
    public sido!: string;
    public sigungu!: string;
    public zonecode!: string;
    public road_address!: string;
    public introduction!: string;

    public readonly createdAt!: Date;

    public static associate(models: any) {
      Restaurant.belongsTo(models.Users, {
        foreignKey: "manager",
      });
      Restaurant.hasMany(models.ExposureMenu, {
        sourceKey: "id",
        as: 'exposure_menu',
        foreignKey: "restaurant_id",
      })
      Restaurant.hasMany(models.EntireMenu, {
        sourceKey: "id",
        as: 'entire_menu',
        foreignKey: "restaurant_id",
      })
      Restaurant.hasMany(models.Images, {
        sourceKey: "id",
        as: 'restaurant_images',
        foreignKey: "restaurant_id",
      })
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
      bname: {
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
      label: {
        type: DataTypes.STRING(45),
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
      },
      road_address:{
        type: DataTypes.STRING(100),
        allowNull: true
      },
      introduction: {
        type: DataTypes.STRING(1000),
        allowNull: true
      }
    },
    {
      modelName: 'Restaurant',
      tableName: 'restaurant',
      sequelize,
      freezeTableName: true,
      timestamps: true,
      paranoid: true
    }
  )

  return Restaurant;
}
