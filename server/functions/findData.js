const { mongoose } = require("../db/mongoose");

const findAllData = () => {
  let models = [];
  models.push(mongoose.models.NetworkSpeed);
  return Promise.all(models.map(model => model.find()));
};

module.exports = { findAllData };
