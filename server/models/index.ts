'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.ts')[env];
const db: any = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

fs
  .readdirSync(__dirname).
  filter((file: string) => {
    return (
      file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
  })
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    // const model = sequelize['import'](path.join(__dirname, file)); 
    console.log(model)
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
