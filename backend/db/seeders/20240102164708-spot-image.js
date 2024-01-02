"use strict";

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require("../models");
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
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Baggins_residence_%27Bag_End%27_with_party_sign.jpg/1280px-Baggins_residence_%27Bag_End%27_with_party_sign.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://static.wikia.nocookie.net/lotr/images/0/0c/Isengard_after.jpeg/revision/latest/scale-to-width-down/1000?cb=20181209004208",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://static.wikia.nocookie.net/lotr/images/f/f9/Barad-dur.jpg/revision/latest/scale-to-width-down/1000?cb=20120303195552",
          preview: true,
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
    options.tableName = "SpotImages";
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
