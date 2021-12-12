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
      Images.belongsTo(models.Restaurant, {
        foreignKey: "exposure_menu_id",
      });
      Images.belongsTo(models.Accommodation, {
        foreignKey: "accommodation_id",
      });
      Images.belongsTo(models.ExposureMenu, {
        foreignKey: "exposure_menu_id",
      });
      Images.belongsTo(models.Rooms, {
        foreignKey: "rooms_id",
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
        comment: "1: Restaurant / 11: ExposureMenu / 2: Accommodation / 21: Rooms"
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
