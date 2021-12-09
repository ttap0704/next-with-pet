import {
  Model,
} from 'sequelize';

interface EntireMenuCategoryAttributes {
  id: number;
  category: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class EntireMenuCategory extends Model<EntireMenuCategoryAttributes>
    implements EntireMenuCategoryAttributes {
    public readonly id!: number;
    public category!: string;

    public static associate(models: any) {
      EntireMenuCategory.hasMany(models.Images, {
        sourceKey: 'id',
        foreignKey: "category_id",
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
