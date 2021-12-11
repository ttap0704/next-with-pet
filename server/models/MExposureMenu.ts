import {
  Model,
} from 'sequelize';

interface ExposureMenuAttributes {
  id: number;
  label: string;
  price: number;
  comment: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ExposureMenu extends Model<ExposureMenuAttributes>
    implements ExposureMenuAttributes {
    public readonly id!: number;
    public label!: string;
    public price!: number;
    public comment!: string;

    public static associate(models: any) {
      ExposureMenu.belongsTo(models.Restaurant, {
        foreignKey: "restaurant_id",
      });
    };
  }

  ExposureMenu.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      label: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
    },
    {
      modelName: 'ExposureMenu',
      tableName: 'exposure_menu',
      sequelize,
      freezeTableName: true,
      timestamps: true,
      createdAt: false,
      updatedAt: false,
    }
  )

  return ExposureMenu;
};