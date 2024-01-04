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

router.delete("/:imageId", requireAuth, async (req, res) => {
  const { user } = req;

  const image = await SpotImage.findByPk(req.params.imageId, {
    include: {
      model: Spot,
    },
  });

  if (!image) {
    return res.status(404).json({ message: "Spot image couldn't be found" });
  }

  if (user.id !== image.Spot.ownerId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await image.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
