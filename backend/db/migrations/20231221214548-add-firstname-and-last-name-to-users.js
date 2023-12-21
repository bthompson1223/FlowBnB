"use strict";

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn(
      "Users",
      "firstName",
      {
        type: Sequelize.STRING,
      },
      options
    );
    queryInterface.addColumn(
      "Users",
      "lastName",
      {
        type: Sequelize.STRING,
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn(
      "Users",
      "firstName",
      {
        type: Sequelize.STRING,
      },
      options
    );
    queryInterface.removeColumn(
      "Users",
      "lastName",
      {
        type: Sequelize.STRING,
      },
      options
    );
  },
};
