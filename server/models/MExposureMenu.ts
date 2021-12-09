import {
  Model,
} from 'sequelize';

interface ExposureMenuAttributes {
  id: number;
  label: string;
  price: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class ExposureMenu extends Model<ExposureMenuAttributes>
    implements ExposureMenuAttributes {
    public readonly id!: number;
    public label!: string;
    public price!: number;

    public static associate(models: any) {
      ExposureMenu.hasMany(models.Images, {
        sourceKey: 'id',
        foreignKey: "target",
      });
      
      ExposureMenu.belongsTo(models.Restaurant, {
        foreignKey: "restraunt_id",
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