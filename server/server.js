const express = require("express");
const exphbs = require("express-handlebars");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator/check");
const { mongoose } = require("./db/mongoose");
const { Temp } = require("./models/temp");
const moment = require("moment");

const path = require("path");

const port = process.env.PORT || 3000;
const app = express();

const publicPath = path.join(__dirname, "..", "public");
const views = path.join(__dirname, "..", "public", "views");
const layouts = path.join(__dirname, "..", "public", "views", "layouts");
const partials = path.join(__dirname, "..", "public", "views", "partials");

hbs.registerPartials(partials);

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.set("views", views);
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "index",
    extname: ".hbs",
    layoutsDir: layouts,
    partialsDir: partials
  })
);

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
              data.push(doc[0]);
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

app.get("/", (request, response) => {
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
      response.render("home", { data });
    })
    .catch(error => {
      return response.status(400).send({ error: error["message"] });
    });
});

// GET /tempgraph

app.get("/tempgraph", (request, response) => {
  Temp.find({})
    .then(doc => {
      response.render("tempgraph");
    })
    .catch(error => {
      response.status(400).send({ error: error["message"] });
    });
});

// POST to /api/temp

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

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

module.exports = { app };
