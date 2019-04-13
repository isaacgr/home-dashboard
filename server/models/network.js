const mongoose = require("mongoose");

const networkSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    description: { type: String, required: true },
    data: {
      createdAt: { type: String, default: null },
      values: {}
    }
  },
  { versionKey: false }
);

const NetworkSpeed = mongoose.model("NetworkSpeed", networkSchema);
const NetworkAddress = mongoose.model("NetworkAddress", networkSchema);

module.exports = { NetworkSpeed, NetworkAddress };
