module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false
      }
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  },
};