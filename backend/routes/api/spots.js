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

//middleware to validate spot info
const checkSpotDetails = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Name is required"),
  check("name")
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 character"),
  check("description")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

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
    currentSpot.previewImage = previewImage.url || null;
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

router.get("/:spotId(\\d+)/reviews", async (req, res) => {
  const reviews = await Review.findAll({
    where: {
      spotId: req.params.spotId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  if (reviews.length === 0 || !reviews) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  res.json(reviews);
});

router.get("/:spotId(\\d+)", async (req, res) => {
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

router.post("/", requireAuth, checkSpotDetails, async (req, res) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const newSpot = await Spot.create({
    ownerId: user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201).json(newSpot);
});

router.post("/:spotId(\\d+)/images", requireAuth, async (req, res) => {
  const { user } = req;
  let spot = await Spot.findOne({
    where: {
      id: req.params.spotId,
    },
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (!req.body.url) {
    return res.status(400).json({ message: "URL is required" });
  }

  let newImage = await spot.createSpotImage({
    url: req.body.url,
    preview: req.body.preview,
  });

  newImage = newImage.toJSON();
  delete newImage.createdAt;
  delete newImage.updatedAt;
  delete newImage.spotId;

  res.json(newImage);
});

router.put(
  "/:spotId(\\d+)",
  requireAuth,
  checkSpotDetails,
  async (req, res) => {
    const { user } = req;
    let spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
    if (user.id !== spot.ownerId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;

    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save();
    res.json(spot);
  }
);

router.delete("/:spotId(\\d+)", requireAuth, async (req, res) => {
  const { user } = req;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }
  if (spot.ownerId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await spot.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
