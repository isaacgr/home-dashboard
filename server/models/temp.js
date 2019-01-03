const mongoose = require("mongoose");

const Temp = mongoose.model("Dashboard", {
  location: { type: String, required: true },
  values: [
    {
      temp: { type: Number, required: true },
      humid: { type: Number, required: true },
      temp_f: { type: Number, default: null },
      createdAt: { type: String, default: null }
    }
  ]
});

module.exports = { Temp };
