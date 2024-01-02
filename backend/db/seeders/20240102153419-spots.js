"use strict";

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require("../models");
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

    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "1 Bagshot Row",
          city: "Hobbiton",
          state: "The Shire",
          country: "Middle Earth",
          lat: 24.23423,
          lng: 12.78943,
          name: "Baggins' House",
          description:
            "Bag End is the luxurious home of Bilbo Baggins and later Frodo Baggins.",
          price: 129.99,
        },
        {
          ownerId: 2,
          address: "5 Isengard Lane",
          city: "Ring of Isengard",
          state: "Isengard",
          country: "Middle Earth",
          lat: 54.23423,
          lng: 36.78943,
          name: "Orthanc",
          description:
            "Orthanc was the black, impenetrable tower of Isengard built by the Dúnedain.",
          price: 324.99,
        },
        {
          ownerId: 3,
          address: "22 Doom Road",
          city: "Gorgoroth",
          state: "Mordor",
          country: "Middle Earth",
          lat: 154.23423,
          lng: 182.78943,
          name: "Barad-dûr",
          description:
            "Barad-dûr was a tower built by Sauron as his central stronghold in Mordor.",
          price: 99.99,
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
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["Baggins' House", "Orthanc", "Barad-dûr"] },
      },
      {}
    );
  },
};
