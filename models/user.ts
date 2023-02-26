import Seq, { ModelDefined, Sequelize } from 'sequelize'
 
export default (sequelize: Sequelize, DataTypes:typeof Seq.DataTypes) => {

  const Users:ModelDefined<any,any> = sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },);

  return Users;
};