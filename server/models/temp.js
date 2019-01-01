const mongoose = require("mongoose");

const Temp = mongoose.model("Dashboard", {
  temp: { type: Number, require },
  humid: { type: Number, require },
  loc: { type: String, require },
  temp_f: { type: Number, default: null },
  createdAt: { type: Number, default: null }
});

module.exports = { Temp };
