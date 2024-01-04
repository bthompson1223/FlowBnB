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

module.exports = router;
