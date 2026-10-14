const express = require("express");
const Lost    = require("../models/Lost");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/lost — get all lost item reports
router.get("/", protect, async (req, res) => {
  try {
    const items = await Lost.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/lost — report a lost item
router.post("/", protect, async (req, res) => {
  try {
    const { itemName, description, location, date, contact } = req.body;

    if (!itemName || !description || !location || !contact)
      return res.status(400).json({ message: "itemName, description, location and contact are required." });

    const item = await Lost.create({
      itemName,
      description,
      location,
      date:    date || "",
      contact,
      owner: req.user.username,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/lost/:id/accept — accept a lost item request (someone found it)
router.patch("/:id/accept", protect, async (req, res) => {
  try {
    const item = await Lost.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Lost item report not found." });
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
