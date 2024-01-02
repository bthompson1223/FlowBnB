const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

router.get("/", async (req, res) => {
  const spots = await Spot.findAll();
  let results = [];
  for (let i = 0; i < spots.length; i++) {
    currentSpot = { ...spots[i].dataValues };
    const totalReviews = await Review.count({
      where: {
        spotId: spots[i].dataValues.id,
      },
    });
    const reviewSum = await Review.sum("stars", {
      where: {
        spotId: spots[i].dataValues.id,
      },
    });
    const reviewAvg = reviewSum / totalReviews;

    const previewImage = await SpotImage.findOne({
      where: {
        spotId: spots[i].dataValues.id,
      },
    });

    currentSpot.avgRating = reviewAvg;
    currentSpot.previewImage = previewImage.url;
    results.push(currentSpot);
  }
  res.json({
    Spots: results,
  });
});

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const spots = await Spot.findAll({
    where: {
      ownerId: user.id,
    },
  });
  let results = [];
  for (let i = 0; i < spots.length; i++) {
    currentSpot = { ...spots[i].dataValues };
    const totalReviews = await Review.count({
      where: {
        spotId: spots[i].dataValues.id,
      },
    });
    const reviewSum = await Review.sum("stars", {
      where: {
        spotId: spots[i].dataValues.id,
      },
    });
    const reviewAvg = reviewSum / totalReviews;

    const previewImage = await SpotImage.findOne({
      where: {
        spotId: spots[i].dataValues.id,
      },
    });

    currentSpot.avgRating = reviewAvg;
    currentSpot.previewImage = previewImage.url;
    results.push(currentSpot);
  }
  res.json({
    Spots: results,
  });
});

router.get("/:spotId", async (req, res) => {
  const id = req.params.spotId;
  let spot = await Spot.findByPk(id);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  let owner = await User.findByPk(spot.ownerId, {
    attributes: ["id", "firstName", "lastName"],
  });
  let images = await SpotImage.findAll({
    where: {
      spotId: id,
    },
  });
  const numReviews = await Review.count({
    where: {
      spotId: id,
    },
  });

  const totalRating = await Review.sum("stars", {
    where: {
      spotId: id,
    },
  });

  const avgStarRating = totalRating / numReviews;

  spot = spot.toJSON();
  owner = owner.toJSON();

  spot.numReviews = numReviews;
  spot.avgStarRating = avgStarRating;
  spot.SpotImages = images;
  spot.Owner = owner;

  res.json(spot);
});

module.exports = router;
