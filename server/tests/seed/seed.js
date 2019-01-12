const { Temp } = require("../../models/temp");
const { ObjectID } = require("mongodb");

const temps = [
  {
    _id: new ObjectID(),
    location: "test suite",
    values: [
      {
        _id: new ObjectID(),
        temp: 23,
        temp_f: 72,
        humid: 30,
        createdAt: "2019"
      },
      {
        _id: new ObjectID(),
        temp: 69,
        temp_f: 69,
        humid: 69,
        createdAt: "2019"
      }
    ]
  },
  {
    _id: new ObjectID(),
    location: "another test suite",
    values: [
      {
        _id: new ObjectID(),
        temp: 30,
        temp_f: 78,
        humid: 60,
        createdAt: "2019"
      },
      {
        _id: new ObjectID(),
        temp: 13,
        temp_f: 13,
        humid: 13,
        createdAt: "2019"
      }
    ]
  }
];

const populateTemps = done => {
  Temp.remove({})
    .then(() => {
      const temp1 = new Temp(temps[0]).save();
      const temp2 = new Temp(temps[1]).save();
      return Promise.resolve([temp1, temp2]);
    })
    .then(() => done());
};

module.exports = { temps, populateTemps };
