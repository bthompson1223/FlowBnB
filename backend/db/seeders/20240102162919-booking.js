"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Booking.bulkCreate(
      [
        {
          spotId: 1,
          userId: 2,
          startDate: "2020-01-10",
          endDate: "2026-12-24",
        },
        {
          spotId: 2,
          userId: 3,
          startDate: "2023-10-30",
          endDate: "2023-12-31",
        },
        {
          spotId: 3,
          userId: 1,
          startDate: "2021-11-20",
          endDate: "2021-12-24",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
