const mongoose = require("mongoose");

const issSchema = new mongoose.Schema(
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

const ISSLocation = mongoose.model("ISSLocation", issSchema);

module.exports = { ISSLocation };
