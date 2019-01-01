const express = require("express");
const exphbs = require("express-handlebars");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const validator = require("express-validator");
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

app.get("/api/temp", (request, response) => {
  Temp.findOne()
    .sort({ created: -1 })
    .limit(1)
    .then(doc => {
      response.send(doc);
    });
});

app.get("/", (request, response) => {
  Temp.findOne()
    .sort({ created: -1 })
    .limit(1)
    .then(
      doc => {
        const temp = {
          ...doc.toObject()
        };
        response.render("home", {
          ...temp
        });
      },
      error => {
        response.status(400).send(error);
      }
    );
});

app.post("/api/temp", (request, response) => {
  if (request.body.key !== process.env.SECRET) {
    console.log({ error: "invalid key" });
    return response.status(400).send({ error: "invalid key" });
  }
  const date = new moment();

  const temp = new Temp({
    temp: request.body.temp,
    humid: request.body.humid,
    loc: request.body.loc,
    temp_f: request.body.temp_f,
    created: {
      time: date,
      timeStamp: date.format()
    }
  });

  temp.save().then(
    doc => {
      data = request.body;
      console.log("OK");
      response.status(200).send("OK");
    },
    error => {
      response.status(400).send(error);
    }
  );
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
