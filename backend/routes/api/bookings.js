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

router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const bookings = await Booking.findAll({
    where: {
      userId: user.id,
    },
    include: {
      model: Spot,
    },
  });

  const bookingsArr = [];

  bookings.forEach((booking) => {
    booking = booking.toJSON();
    bookingsArr.push(booking);
  });

  for (let i = 0; i < bookingsArr.length; i++) {
    const booking = bookingsArr[i];
    const preview = await SpotImage.findOne({
      where: {
        spotId: booking.Spot.id,
      },
    });
    booking.Spot.previewImage = preview.url;

    delete booking.Spot.description;
    delete booking.Spot.createdAt;
    delete booking.Spot.updatedAt;
  }

  res.json({ Bookings: bookingsArr });
});

router.put("/:bookingId", requireAuth, async (req, res) => {
  const { user } = req;
  const { startDate, endDate } = req.body;

  let booking = await Booking.findByPk(req.params.bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }
  if (user.id !== booking.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const bookings = await Booking.findAll({
    where: {
      spotId: booking.spotId,
    },
  });

  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  const errorObj = {};

  if (!startDate) {
    errorObj.startDate = "Please provide a valid Start Date";
  }

  if (!endDate) {
    errorObj.endDate = "Please provide a valid End Date";
  }

  if (newEndDate <= newStartDate) {
    errorObj.endDate = "endDate cannot be on or before startDate";
  }

  if (Object.keys(errorObj).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errorObj,
    });
  }

  const currentDate = new Date().getTime();
  const testEndDate = new Date(endDate).getTime();
  if (currentDate >= testEndDate) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
    });
  }

  for (const currBooking of bookings) {
    if (currBooking.id !== booking.id) {
      const currStartDate = new Date(currBooking.startDate);
      const currEndDate = new Date(currBooking.endDate);

      if (
        newStartDate.getTime() === currStartDate.getTime() &&
        newEndDate.getTime() === currEndDate.getTime()
      ) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      }

      if (newStartDate.getTime() === currStartDate.getTime()) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
          },
        });
      }

      if (newStartDate.getTime() === currEndDate.getTime()) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
          },
        });
      }

      if (newEndDate.getTime() === currStartDate.getTime()) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            endDate: "End date conflicts with an existing booking",
          },
        });
      }

      if (newEndDate.getTime() === currEndDate.getTime()) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            endDate: "End date conflicts with an existing booking",
          },
        });
      }

      if (newStartDate > currStartDate && newEndDate < currEndDate) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      }

      if (newStartDate >= currStartDate && newStartDate < currEndDate) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
          },
        });
      }

      if (newEndDate > currStartDate && newEndDate <= currEndDate) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            endDate: "End date conflicts with an existing booking",
          },
        });
      }

      if (newStartDate <= currStartDate && newEndDate >= currEndDate) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      }
    }

    if (newStartDate.getTime() === newEndDate.getTime()) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          startDate: "Start and end date are the same",
          endDate: "Start and end date are the same",
        },
      });
    }

    if (newEndDate.getTime() < newStartDate.getTime()) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "End date cannot be before start date",
        },
      });
    }
  }

  booking.startDate = startDate;
  booking.endDate = endDate;
  await booking.save();

  res.json(booking);
});

router.delete("/:bookingId(\\d+)", requireAuth, async (req, res) => {
  const { user } = req;
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }
  if (user.id !== booking.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const currentTime = new Date().getTime();
  const startDate = new Date(booking.startDate).getTime();
  if (currentTime >= startDate) {
    return res
      .status(403)
      .json({ message: "Bookings that have been started can't be deleted" });
  }

  await booking.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
