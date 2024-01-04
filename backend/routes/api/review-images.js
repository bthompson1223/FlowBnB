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
  const image = await ReviewImage.findByPk(req.params.imageId, {
    include: { model: Review, attributes: ["userId"] },
  });
  if (!image || !image.Review) {
    return res.status(404).json({ message: "Review Image couldn't be found" });
  }

  if (image.Review.userId !== user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await image.destroy();
  res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
