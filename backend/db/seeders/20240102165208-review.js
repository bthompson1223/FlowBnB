"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Review } = require("../models");
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
    Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: "A must visit for anyone that loves nature and food!",
        stars: 5,
      },
      {
        spotId: 2,
        userId: 3,
        review:
          "A great place for those that need alone time, though there were armored men singing about hobbits throughout the night.",
        stars: 4,
      },
      {
        spotId: 3,
        userId: 1,
        review:
          "Way too hot! Also there was a kid that got attacked by a feral hairless cat last night at the volcano.",
        stars: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Review";
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
