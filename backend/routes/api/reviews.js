const express = require("express");
const router = express.Router();
const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  let reviews = await Review.findAll({
    where: {
      userId: user.id,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  let reviewArr = [];
  reviews.forEach((review) => {
    review = review.toJSON();
    reviewArr.push(review);
  });

  for (let i = 0; i < reviewArr.length; i++) {
    const review = reviewArr[i];
    const image = await SpotImage.findOne({
      where: {
        spotId: review.Spot.id,
      },
      attributes: ["url"],
    });
    review.Spot.previewImage = image.url;
  }

  let result = {};
  if (reviewArr.length) {
    result.Reviews = reviewArr;
  }

  res.json(result);
});

module.exports = router;
