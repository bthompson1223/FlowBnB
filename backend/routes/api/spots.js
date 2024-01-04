const express = require("express");
const router = express.Router();
const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

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

const queryFilters = async (req, res, next) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;
  let where = {
    lat: {
      [Op.between]: [minLat || -180.1, maxLat || 180.1],
    },
    lng: {
      [Op.between]: [minLng || -180.1, maxLng || 180.1],
    },
    price: {
      [Op.between]: [minPrice || 0.01, maxPrice || 1000000.01],
    },
  };
  let tripped = false;
  const err = {};
  err.message = "Bad Request";
  err.errors = {};
  //   function isNumber(value) {
  //     return typeof value === "number";
  //   }
  if (page && page < 1) {
    err.errors.page = "Page must be greater than or equal to 1";
    tripped = true;
  }
  if (size && size < 1) {
    err.errors.size = "Size must be greater than or equal to 1";
    tripped = true;
  }
  if ((maxLat && maxLat > 90) || (maxLat && maxLat < -90)) {
    err.errors.maxLat = "Maximum latitude is invalid";
    tripped = true;
  }
  if ((minLat && minLat < -90) || (minLat && minLat > 90)) {
    err.errors.minLat = "Minimum latitude is invalid";
    tripped = true;
  }
  if ((maxLng && maxLng > 180) || (maxLng && maxLng < -180)) {
    err.errors.maxLng = "Maximum longitude is invalid";
    tripped = true;
  }
  if ((minLng && minLng < -180) || (minLng && minLng > 180)) {
    err.errors.minLng = "Minimum longitude is invalid";
    tripped = true;
  }
  if (minPrice && minPrice < 0) {
    err.errors.minPrice = "Minimum price must be greater than or equal to 0";
    tripped = true;
  }
  if (maxPrice && maxPrice < 0) {
    err.errors.maxPrice = "Maximum price must be greater than or equal to 0";
    tripped = true;
  }
  if ((page && isNaN(page)) || (page && page > 10) || !page) page = 1;
  if ((size && isNaN(size)) || (size && size > 20) || !size) size = 20;
  page = parseInt(page);
  size = parseInt(size);
  let limit = size;
  let offset = size * (page - 1);

  req.pagination = {
    limit,
    offset,
    size,
    page,
    where,
  };
  if (tripped) {
    err.status = 400;
    next(err);
  }

  next();
};

router.get("/", queryFilters, async (req, res) => {
  const { size, page, where, limit, offset } = req.pagination;

  const spots = await Spot.findAll({ where, limit, offset });
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
    if (previewImage) currentSpot.previewImage = previewImage.url;
    else currentSpot.previewImage = null;
    results.push(currentSpot);
  }
  res.json({
    Spots: results,
    page,
    size,
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
    if (previewImage) currentSpot.previewImage = previewImage.url;
    else currentSpot.previewImage = null;
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
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  res.json({ Reviews: reviews });
});

router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { user } = req;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (!user.id === spot.ownerId) {
    const bookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId,
      },
      attributes: ["spotId", "startDate", "endDate"],
    });
    return res.json(bookings);
  } else {
    const bookings = await Booking.findAll({
      where: {
        spotId: req.params.spotId,
      },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      attributes: [
        "id",
        "spotId",
        "userId",
        "startDate",
        "endDate",
        "createdAt",
        "updatedAt",
      ],
    });
    res.json(bookings);
  }
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

router.post("/:spotId(\\d+)/reviews", requireAuth, async (req, res) => {
  const { user } = req;
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const { review, stars } = req.body;

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

  let userReview = false;

  const reviews = await Review.findAll({
    where: {
      userId: user.id,
      spotId: req.params.spotId,
    },
  });

  if (reviews.length) userReview = true;

  if (userReview) {
    return res
      .status(500)
      .json({ message: "User already has a review for this spot" });
  }

  const newReview = await spot.createReview({
    userId: user.id,
    review,
    stars,
  });

  res.status(201).json(newReview);
});

router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const { user } = req;
  const userId = user.id;

  const spot = await Spot.findByPk(req.params.spotId);
  const body = req.body;

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId === user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const bookings = await Booking.findAll({
    where: {
      spotId: spot.id,
    },
  });

  const newStart = new Date(body.startDate);
  const newEnd = new Date(body.endDate);

  if (newStart < Date.now()) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "startDate cannot be in the past",
      },
    });
  }

  for (const currBooking of bookings) {
    const currStartDate = new Date(currBooking.startDate);
    const currEndDate = new Date(currBooking.endDate);

    if (
      newStart.getTime() === currStartDate.getTime() &&
      newEnd.getTime() === currEndDate.getTime()
    ) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    if (newStart.getTime() === currStartDate.getTime()) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
        },
      });
    }

    if (newStart.getTime() === currEndDate.getTime()) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
        },
      });
    }

    if (newEnd.getTime() === currStartDate.getTime()) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    if (newEnd.getTime() === currEndDate.getTime()) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    if (newStart > currStartDate && newEnd < currEndDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    if (newStart >= currStartDate && newStart < currEndDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
        },
      });
    }

    if (newEnd > currStartDate && newEnd <= currEndDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    if (newStart <= currStartDate && newEnd >= currEndDate) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }
  }

  if (newStart.getTime() === newEnd.getTime()) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        startDate: "Start and end date are the same",
        endDate: "Start and end date are the same",
      },
    });
  }

  if (newEnd.getTime() < newStart.getTime()) {
    return res.status(400).json({
      message: "Bad Request",
      errors: {
        endDate: "End date cannot be before start date",
      },
    });
  }

  body.userId = userId;
  body.spotId = spot.id;

  const newBooking = await Booking.create(body);
  await newBooking.save();
  const formattedBooking = {
    ...newBooking.dataValues,
    startDate: newBooking.startDate,
    endDate: newBooking.endDate,
    createdAt: newBooking.createdAt,
    updatedAt: newBooking.updatedAt,
  };
  // await formattedBooking.save()
  res.json(formattedBooking);
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
