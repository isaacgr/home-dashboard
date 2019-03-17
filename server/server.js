const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator/check");
const { mongoose } = require("./db/mongoose");
const { Temp, Data } = require("./models/temp");
const { devSeedData } = require("./tests/seed/devSeedData");
const moment = require("moment");

const path = require("path");

const port = process.env.PORT || 3000;
const app = express();

const publicPath = path.join(__dirname, "..", "public");

app.use(express.static(publicPath));
app.use(bodyParser.json());

// GET /api/temp/all

app.get("/api/temp/all", (request, response) => {
  const limit = request.query.limit
    ? {
        values: {
          $slice: parseInt(request.query.limit)
        }
      }
    : {};
  Temp.find({}, limit)
    .then(doc => {
      response.send(doc);
    })
    .catch(error => {
      response.status(400).send({ error: error["message"] });
    });
});

app.get("/api/temp", (request, response) => {
  let data = [];
  Temp.find()
    .then(doc => {
      return new Promise((resolve, reject) => {
        doc.map((dataset, idx, arr) => {
          Temp.aggregate([{ $match: dataset }])
            .unwind("values")
            .sort({ "values.createdAt": -1 })
            .limit(1)
            .then(doc => {
              data.push({
                ...doc[0],
                values: {
                  ...doc[0].values,
                  createdAt: moment(doc[0].values.createdAt).format("LLL")
                }
              });
              if (data.length === arr.length) {
                resolve(data);
              }
            })
            .catch(error => {
              return response.status(400).send({ error: error["message"] });
            });
        });
      });
    })
    .then(data => {
      response.status(200).send({ data });
    })
    .catch(error => {
      return response.status(400).send({ error: error["message"] });
    });
});

app.post("/api/data", (request, response) => {
  console.log(request.body);
  return response.status(200).send("OK");
});

app.post(
  "/api/temp",
  [
    check("temp")
      .exists()
      .isNumeric(),
    check("humid")
      .exists()
      .isNumeric(),
    check("loc")
      .exists()
      .isString()
  ],
  check("key")
    .equals(process.env.SECRET)
    .withMessage("invalid key"),
  (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response
        .status(422)
        .send({ errors: errors.array({ onlyFirstError: true }) });
    }

    const date = new moment();

    const temp = Temp.updateOne(
      { location: request.body.loc },
      {
        $push: {
          values: [
            {
              temp: request.body.temp,
              humid: request.body.humid,
              temp_f: request.body.temp_f,
              createdAt: date.format("YYYY-MM-DDTHH:mm:ss")
            }
          ]
        }
      },
      { upsert: true }
    );

    temp
      .then(doc => {
        console.log("OK");
        response.status(200).send("OK");
      })
      .catch(error => {
        console.log(error);
        response.status(400).send({ error: error["message"] });
      });
  }
);

// POST /api/temp/seed
// only while running local host, not for production
app.post("/api/temp/seed", (request, response) => {
  if (process.env.NODE_ENV !== "development") {
    return response.status(400).send({ error: "only for development testing" });
  }
  Temp.remove({})
    .then(() => {
      const seed = new Temp(devSeedData[0]).save();
      Promise.resolve(seed);
    })
    .then(() => {
      return response.status(200).send({ success: "db seeded" });
    });
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
  app.get("*", (request, response) => {
    response.sendfile(path.join(publicPath, "index.html"));
  });
});

module.exports = { app };
