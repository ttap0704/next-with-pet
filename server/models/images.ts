import {
  Model,
} from 'sequelize';

interface ImagesAttributes {
  id: number;
  file_name: string;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Images extends Model<ImagesAttributes>
    implements ImagesAttributes {
    public readonly id!: number;
    public file_name!: string;

    public static associate(models: any) {
      Images.hasOne(models.ExposureMenu, {
        sourceKey: 'id',
        foreignKey: "image_id"
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
    },
    {
      modelName: 'Images',
      tableName: 'images',
      sequelize,
      freezeTableName: true,
      timestamps: true
    }
  )

  return Images;
}
