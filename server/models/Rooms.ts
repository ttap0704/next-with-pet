import {
  Model,
} from 'sequelize';

interface RoomsAttributes {
  id: number;
  label: string;
  price: number;
  standard_num: number;
  maximum_num: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Rooms extends Model<RoomsAttributes>
    implements RoomsAttributes {
    public readonly id!: number;
    public label!: string;
    public price!: number;
    public standard_num!: number;
    public maximum_num!: number;

    public static associate(models: any) {
      Rooms.hasMany(models.Images, {
        sourceKey: 'id',
        foreignKey: "target",
      });
      Rooms.belongsTo(models.Restaurant, {
        foreignKey: "accommodation_id",
      });
    };
  }

  Rooms.init(
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
        type: DataTypes.INTEGER,
        allowNull: true
      },
      standard_num: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      maximum_num: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      modelName: 'Rooms',
      tableName: 'rooms',
      sequelize,
      freezeTableName: true,
      timestamps: true,
      createdAt: false,
      updatedAt: false,
    }
  )

  return Rooms;
};