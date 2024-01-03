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
  console.log(user.id);
  let reviews = await Review.findAll({
    where: {
      userId: user.id,
    },
    include: [
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

  reviews = reviews.toJSON();

  const previewImage = await SpotImage.findOne({
    where: {
      spotId: reviews[1].id,
    },
    attributes: ["url"],
  });

  reviews[1].previewImage = previewImage;

  res.json(reviews);
});

module.exports = router;
