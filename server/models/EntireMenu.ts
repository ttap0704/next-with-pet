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
        foreignKey: "restraunt_id",
        as: 'restaurantIdBelongsToRestaurantId'
      });
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
        allowNull: true
      },
      price: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
    },
    {
      modelName: 'EntireMenu',
      tableName: 'entire_menu',
      sequelize,
      freezeTableName: true,
      timestamps: true
    }
  )

  return EntireMenu;
}
