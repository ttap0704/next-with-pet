import {
  Model,
} from 'sequelize';

interface EntireMenuAttributes {
  id: number;
  category: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class EntireMenu extends Model<EntireMenuAttributes>
    implements EntireMenuAttributes {
    public readonly id!: number;
    public category!: string;

    public static associate(models: any) {
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
      timestamps: true,
      createdAt: false,
      updatedAt: false
    }
  )

  return EntireMenu;
}
