import {
  Model,
} from 'sequelize';

interface EntireMenuAttributes {
  id: number;
  label: string;
  price: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class EntireMenu extends Model<EntireMenuAttributes>
    implements EntireMenuAttributes {
    public readonly id!: number;
    public label!: string;
    public price!: number;

    public static associate(models: any) {
      EntireMenu.belongsTo(models.Restaurant, {
        foreignKey: "restaurant_id",
      });

      EntireMenu.belongsTo(models.EntireMenuCategory, {
        foreignKey: "category_id",
      })
    };
  }

  EntireMenu.init(
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
      modelName: 'EntireMenu',
      tableName: 'entire_menu',
      sequelize,
      freezeTableName: true,
      timestamps: true,
      paranoid: true
    }
  )

  return EntireMenu;
}
