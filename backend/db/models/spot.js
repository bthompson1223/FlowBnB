"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
      });

      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
      });
      Spot.belongsToMany(models.User, {
        foreignKey: "spotId",
        otherKey: "userId",
        through: models.Review,
      });
      Spot.belongsToMany(models.User, {
        foreignKey: "spotId",
        otherKey: "userId",
        through: models.Booking,
      });
    }
  }
  Spot.init(
    {
      ownderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      lat: DataTypes.FLOAT,
      lng: DataTypes.FLOAT,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
