const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    serviceType: { type: String, required: true },
    description: { type: String, default: "" },
    location:    { type: String, required: true },
    preferred:   { type: String, default: "" },
    contact:     { type: String, required: true },
    owner:       { type: String, required: true }, // username of requester
    status:      { type: String, enum: ["Pending", "Accepted"], default: "Pending" },
    acceptedBy:  { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
