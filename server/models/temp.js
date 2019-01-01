const mongoose = require("mongoose");

const Temp = mongoose.model("Dashboard", {
  temp: { type: Number, required: true },
  humid: { type: Number, required: true },
  loc: { type: String, required: true },
  temp_f: { type: Number, default: null },
  created: [
    {
      time: { type: Number, default: null },
      timeStamp: { type: String, default: null }
    }
  ]
});

module.exports = { Temp };
