const mongoose = require("mongoose");
const tempSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    values: [
      {
        temp: { type: Number, required: true },
        humid: { type: Number, required: true },
        temp_f: { type: Number, default: null },
        createdAt: { type: String, default: null }
      }
    ]
  },
  { versionKey: false }
);

const Temp = mongoose.model("Dashboard", tempSchema);

module.exports = { Temp };
