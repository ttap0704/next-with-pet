import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Association,
} from 'sequelize';

const { sequelize } = require('./index') 

interface UsersAttributes {
  id: number | null;
  login_id: string,
  password: string | null,
  wrong_num: number,
  nickname: string,
  license_id: number,
  type: boolean
}


export class Users extends Model<UsersAttributes>{
  public readonly id!: number;
  public login_id!: string;
  public password!: string;
  public wrong_num: number;
  public nickname!: string;
  public license_id!: number;
  public type!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // public getScores!: HasManyGetAssociationsMixin<Scores>; 
  // public addScores!: HasManyAddAssociationMixin<Scores, number>;
  // public hasScores!: HasManyHasAssociationMixin<Scores, number>;
  // public countScores!: HasManyCountAssociationsMixin;
  // public createScores!: HasManyCreateAssociationMixin<Scores>;

  // public static associations: {
  //   userHasManyScores: Association<Users, Scores>;
  // };
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    login_id: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    wrong_num: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0,
    },
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    license_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.TINYINT,
      allowNull: false
    }
  },
  {
    modelName: 'Users',
    tableName: 'Users',
    sequelize,
    freezeTableName: true,
    timestamps: true,
    updatedAt: 'updateTimestamp'
  }
)

// Users.hasMany(Scores, {
//   sourceKey: "id",
//   foreignKey: "user_id",
//   as: 'userHasManyScores'
// });