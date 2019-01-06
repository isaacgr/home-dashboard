const express = require("express");
const exphbs = require("express-handlebars");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const mongoose = require("./db/mongoose");
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

app.get("/tempgraph", (request, response) => {
  Temp.find({})
    .then(doc => {
      response.render("tempgraph");
    })
    .catch(error => {
      response.status(400).send({ error: error["message"] });
    });
});

app.post("/api/temp", (request, response) => {
  if (request.body.key !== process.env.SECRET) {
    console.log({ error: "invalid key" });
    return response.status(400).send({ error: "invalid key" });
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
      data = request.body;
      console.log("OK");
      response.status(200).send("OK");
    })
    .catch(error => {
      response.status(400).send({ error: error["message"] });
    });
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
