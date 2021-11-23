import {
  Model,
} from 'sequelize';

interface RestaurantAttributes {
  id: number;
  baname: string | null;
  building_name: string | null;
  detail_address: string | null;
  label: string;
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
    public label!: string;
    public sido!: string;
    public sigungu!: string;
    public zonecode!: string;

    public readonly createdAt!: Date;

    public static associate(models: any) {
      Restaurant.belongsTo(models.Users, {
        foreignKey: "manager",
      });
      Restaurant.hasMany(models.ExposureMenu, {
        sourceKey: "id",
        foreignKey: "restraunt_id",
      })
      Restaurant.hasMany(models.EntireMenu, {
        sourceKey: "id",
        foreignKey: "restraunt_id",
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

  return Restaurant;
}
