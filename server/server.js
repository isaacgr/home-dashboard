const express = require("express");
const exphbs = require("express-handlebars");
const hbs = require("hbs");
const bodyParser = require("body-parser");

const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;
const app = express();

const views = path.join(__dirname, "..", "public", "views");
const partials = path.join(__dirname, "..", "public", "views", "partials");
hbs.registerPartials(partials);

app.use(bodyParser.json());

app.set("views", views);
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "index",
    extname: ".hbs",
    layoutsDir: views,
    partialsDir: partials
  })
);
app.set("view engine", "hbs");

let data;

app.get("/", (request, response) => {
  response.render("home", {
    ...data
  });
});

app.post("/api/temp", (request, response) => {
  if (!request.body.temp || !request.body.humid) {
    return response.status(500).send({ error: "missing params" });
  }
  data = request.body;

  response.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
