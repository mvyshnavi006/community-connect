const mongoose = require("mongoose");

const lostSchema = new mongoose.Schema(
  {
    itemName:    { type: String, required: true },
    description: { type: String, required: true },
    location:    { type: String, required: true },
    date:        { type: String, default: "" },
    contact:     { type: String, required: true },
    owner:       { type: String, required: true }, // username
    status:      { type: String, enum: ["Pending", "Accepted"], default: "Pending" },
    acceptedBy:  { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lost", lostSchema);
