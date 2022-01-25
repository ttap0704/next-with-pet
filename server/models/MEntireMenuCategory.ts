import {
  Model,
} from 'sequelize';

interface EntireMenuCategoryAttributes {
  id: number;
  category: string;
  seq: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class EntireMenuCategory extends Model<EntireMenuCategoryAttributes>
    implements EntireMenuCategoryAttributes {
    public readonly id!: number;
    public category!: string;
    public seq!: number;

    public static associate(models: any) {
      EntireMenuCategory.hasMany(models.EntireMenu, {
        sourceKey: 'id',
        foreignKey: "category_id",
        as: "menu"
      });
      EntireMenuCategory.belongsTo(models.Restaurant, {
        foreignKey: "restaurant_id",
      });
    };
  }

  EntireMenuCategory.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      category: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      seq: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      modelName: 'EntireMenuCategory',
      tableName: 'entire_menu_category',
      sequelize,
      freezeTableName: true,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  )

  return EntireMenuCategory;
}
