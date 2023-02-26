import { ModelDefined } from "sequelize/types/model";
import Seq, { Sequelize } from "sequelize";

export type ModelFunction = (sequelize:Sequelize, dataType:typeof Seq.DataTypes) => ModelDefined<any, any>

export interface SequelizeDatabase {
  [key: string]: ModelFunction | Sequelize | typeof Sequelize;
  
}