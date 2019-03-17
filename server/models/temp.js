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

const dataSchema = new mongoose.Schema(
  {
    data: {
      type: { type: String, required: true },
      data: {}
    }
  },
  { versionKey: false }
);

const Temp = mongoose.model("Dashboard", tempSchema);
const Data = mongoose.model("Dashboard", dataSchema, "data");

module.exports = { Temp, Data };
