const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName:     { type: String, required: true },
    eventCategory: { type: String, required: true },
    description:   { type: String, required: true },
    location:      { type: String, required: true },
    date:          { type: String, required: true },
    organizer:     { type: String, required: true },
    contact:       { type: String, default: "" },
    owner:         { type: String, required: true }, // username
    attendees:     { type: [String], default: [] },  // list of usernames who registered
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
