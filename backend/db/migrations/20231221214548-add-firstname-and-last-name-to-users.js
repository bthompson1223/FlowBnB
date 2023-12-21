"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn("Users", "firstName", {
      type: Sequelize.STRING,
    });
    queryInterface.addColumn("Users", "lastName", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumnColumn("Users", "firstName", {
      type: Sequelize.STRING,
    });
    queryInterface.removeColumnColumn("Users", "lastName", {
      type: Sequelize.STRING,
    });
  },
};
