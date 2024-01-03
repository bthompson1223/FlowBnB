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

router.post("/:reviewId(\\d+)/images", requireAuth, async (req, res) => {
  const { user } = req;

  const review = await Review.findByPk(req.params.reviewId, {
    include: {
      model: ReviewImage,
    },
  });

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (user.id !== review.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const reviewImages = await ReviewImage.findAll({
    where: {
      reviewId: req.params.reviewId,
    },
  });

  if (reviewImages.length >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  let newImage = await review.createReviewImage({
    url: req.body.url,
  });

  newImage = newImage.toJSON();

  delete newImage.reviewId;
  delete newImage.updatedAt;
  delete newImage.createdAt;

  res.json(newImage);
});

router.put("/:reviewId(\\d+)", requireAuth, async (req, res) => {
  const { user } = req;

  const { review, stars } = req.body;

  let query = await Review.findByPk(req.params.reviewId);

  if (!query) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  if (query.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  let errors = {};
  if (!review) errors.review = "Review text is required";
  if (parseInt(stars) < 1 || parseInt(stars) > 5 || !stars)
    errors.stars = "Stars must be an integer from 1 to 5";
  if (errors.review || errors.stars) {
    return res.status(400).json({
      message: "Bad request",
      errors: {
        review: errors.review,
        stars: errors.stars,
      },
    });
  }

  query.review = review;
  query.stars = stars;

  await query.save();

  res.json(query);
});

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const { user } = req;
  const review = await Review.findByPk(req.params.reviewId);

  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }
  if (user.id !== review.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await review.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
