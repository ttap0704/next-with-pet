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
  Association
} from 'sequelize';

const { sequelize } = require('./index') 

interface UsersAttributes {
  // id: number | null;
  email: string,
  password: string | null,
  nickname: string,
  age: number,
  sex: boolean
}


export class Users extends Model<UsersAttributes>{
  public readonly id!: number;
  public email!: string;
  public password!: string;
  public nickname!: string;
  public age!: number;
  public sex!: boolean;

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
    email: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sex: {
      type: DataTypes.BOOLEAN,
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