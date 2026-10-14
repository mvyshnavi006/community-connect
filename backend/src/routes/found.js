const express = require("express");
const Found   = require("../models/Found");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/found — get all found item reports
router.get("/", protect, async (req, res) => {
  try {
    const items = await Found.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/found — report a found item
router.post("/", protect, async (req, res) => {
  try {
    const { itemName, description, location, date, contact } = req.body;

    if (!itemName || !description || !location || !contact)
      return res.status(400).json({ message: "itemName, description, location and contact are required." });

    const item = await Found.create({
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

// PATCH /api/found/:id/status — owner marks item as Resolved or back to Pending
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const item = await Found.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Found item report not found." });
    if (item.owner !== req.user.username)
      return res.status(403).json({ message: "Only the reporter can update this status." });

    const { status } = req.body;
    if (!["Pending", "Resolved"].includes(status))
      return res.status(400).json({ message: "status must be Pending or Resolved." });

    item.status = status;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
