const express = require("express");
const exphbs = require("express-handlebars");
const hbs = require("hbs");
const bodyParser = require("body-parser");

const fs = require("fs");
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

let data;

app.get("/", (request, response) => {
  response.render("home", {
    ...data
  });
});

app.post("/api/temp", (request, response) => {
  if (!request.body.temp || !request.body.humid || !request.body.loc) {
    return response.status(400).send({ error: "missing params" });
  }
  if (request.body.key !== process.env.SECRET) {
    return response.status(400).send({ error: "invalid key" });
  }
  data = request.body;
  console.log(request.body)
  response.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
