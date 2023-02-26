import * as fs from 'fs';
import * as path from 'path';
import Seq, { Sequelize } from 'sequelize';
import { config } from '../config/sequelizeConfig';
import { SequelizeDatabase } from '../ts';

const db:SequelizeDatabase = {};
const basename = path.basename(__filename);
const sequelize = new Sequelize(config.database as string, config.username as string, config.password as string, config);

fs.readdirSync(__dirname)
  .filter((file) => {
    return file !== basename && file.slice(-3) === '.ts';
  })
  .forEach(async (file) => {
    const model = await import(path.join(__dirname, file));
    db[model.name] = model(sequelize, Seq.DataTypes);
  });
  
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  
  export default db;

