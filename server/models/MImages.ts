import {
  Model,
} from 'sequelize';

interface ImagesAttributes {
  id: number;
  file_name: string;
  category: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Images extends Model<ImagesAttributes>
    implements ImagesAttributes {
    public readonly id!: number;
    public file_name!: string;
    public category!: number;

    public static associate(models: any) {
      Images.belongsTo(models.ExposureMenu, {
        foreignKey: "target",
      });
      Images.belongsTo(models.Restaurant, {
        foreignKey: "target",
      });
      Images.belongsTo(models.Accommodation, {
        foreignKey: "target",
      });
      Images.belongsTo(models.Rooms, {
        foreignKey: "target",
      });
    };
  }

  Images.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      file_name: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      modelName: 'Images',
      tableName: 'images',
      sequelize,
      freezeTableName: true,
      timestamps: true,
      createdAt: false,
      updatedAt: false
    }
  )

  return Images;
}
