const express = require("express");
const Event   = require("../models/Event");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET /api/events — get all events
router.get("/", protect, async (req, res) => {
  try {
    const items = await Event.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events — create an event
router.post("/", protect, async (req, res) => {
  try {
    const { eventName, eventCategory, description, location, date, organizer, contact } = req.body;

    if (!eventName || !eventCategory || !description || !location || !date)
      return res.status(400).json({ message: "eventName, eventCategory, description, location and date are required." });

    const item = await Event.create({
      eventName,
      eventCategory,
      description,
      location,
      date,
      organizer: organizer || req.user.username,
      contact:   contact   || "",
      owner:     req.user.username,
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/events/:id/register — register interest in an event
router.patch("/:id/register", protect, async (req, res) => {
  try {
    const item = await Event.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Event not found." });

    const username = req.user.username;
    if (!item.attendees.includes(username)) {
      item.attendees.push(username);
      await item.save();
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
