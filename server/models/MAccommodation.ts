import {
  Model,
} from 'sequelize';

interface AccommodationAttributes {
  id: number;
  bname: string | null;
  building_name: string | null;
  detail_address: string | null;
  label: string;
  sido: string | null;
  sigungu: string | null;
  zonecode: string | null;
  introduction: string | null;
}

module.exports = (sequelize: any, DataTypes: any) => {
  class Accommodation extends Model<AccommodationAttributes>
    implements AccommodationAttributes {
    public readonly id!: number;
    public bname!: string;
    public building_name!: string;
    public detail_address!: string;
    public label!: string;
    public sido!: string;
    public sigungu!: string;
    public zonecode!: string;
    public introduction!: string;

    public readonly createdAt!: Date;

    public static associate(models: any) {
      Accommodation.belongsTo(models.Users, {
        foreignKey: "manager",
      });
      
      Accommodation.hasMany(models.Rooms, {
        sourceKey: "id",
        as: "accommodation_rooms",
        foreignKey: "accommodation_id",
      });

      Accommodation.hasMany(models.Images, {
        sourceKey: "id",
        as: 'accommodation_images',
        foreignKey: "accommodation_id",
      })
    };
  }

  Accommodation.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      bname: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      building_name: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      detail_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      label: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      sido: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      sigungu: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      zonecode: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      introduction: {
        type: DataTypes.STRING(1000),
        allowNull: true
      }
    },
    {
      modelName: 'Accommodation',
      tableName: 'accommodation',
      sequelize,
      freezeTableName: true,
      timestamps: true
    }
  )

  return Accommodation;
}
