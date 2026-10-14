const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema(
  {
    emergencyType: { type: String, required: true },
    description:   { type: String, required: true },
    location:      { type: String, required: true },
    contact:       { type: String, required: true },
    owner:         { type: String, required: true }, // username of sender
    status:        { type: String, enum: ["Pending", "Accepted"], default: "Pending" },
    acceptedBy:    { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Emergency", emergencySchema);
