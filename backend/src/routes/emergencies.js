const express   = require("express");
const Emergency = require("../models/Emergency");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/emergencies — get all emergency requests
router.get("/", protect, async (req, res) => {
  try {
    const items = await Emergency.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/emergencies — create an emergency request
router.post("/", protect, async (req, res) => {
  try {
    const { emergencyType, description, location, contact } = req.body;

    if (!emergencyType || !description || !location || !contact)
      return res.status(400).json({ message: "All fields are required." });

    const item = await Emergency.create({
      emergencyType,
      description,
      location,
      contact,
      owner: req.user.username,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/emergencies/:id/accept — accept an emergency request
router.patch("/:id/accept", protect, async (req, res) => {
  try {
    const item = await Emergency.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Emergency request not found." });
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
