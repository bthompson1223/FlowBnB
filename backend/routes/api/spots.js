const express = require("express");
const router = express.Router();
const { Spot, Review, SpotImage } = require("../../db/models");

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

module.exports = router;
