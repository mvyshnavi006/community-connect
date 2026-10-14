const express  = require("express");
const Service  = require("../models/Service");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/services — get all service requests
router.get("/", protect, async (req, res) => {
  try {
    const items = await Service.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/services — create a service request
router.post("/", protect, async (req, res) => {
  try {
    const { serviceType, description, location, preferred, contact } = req.body;

    if (!serviceType || !location || !contact)
      return res.status(400).json({ message: "serviceType, location and contact are required." });

    const item = await Service.create({
      serviceType,
      description: description || "",
      location,
      preferred:   preferred || "",
      contact,
      owner: req.user.username,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/services/:id/accept — accept a service request
router.patch("/:id/accept", protect, async (req, res) => {
  try {
    const item = await Service.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Service request not found." });
    if (item.owner === req.user.username)
      return res.status(403).json({ message: "You cannot accept your own request." });
    if (item.status === "Accepted")
      return res.status(400).json({ message: "Already accepted." });

    item.status     = "Accepted";
    item.acceptedBy = req.user.username;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
