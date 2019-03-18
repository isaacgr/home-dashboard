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
    type: { type: String, required: true },
    data: {
      createdAt: { type: String, default: null },
      values: {}
    }
  },
  { versionKey: false }
);

const Temp = mongoose.model("Temperature", tempSchema, "dashboard");
const Data = mongoose.model("Data", dataSchema);

module.exports = { Temp, Data };
