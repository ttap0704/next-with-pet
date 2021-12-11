import {
  Model,
} from 'sequelize';

interface ImagesAttributes {
  id: number;
  file_name: string;
  category: number;
  target: number;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Images extends Model<ImagesAttributes>
    implements ImagesAttributes {
    public readonly id!: number;
    public file_name!: string;
    public category!: number;
    public target!: number;
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
        comment: "1: Restaurant / 11: ExposureMenu / 2: Accomodation / 21: Rooms"
      },
      target: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
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
