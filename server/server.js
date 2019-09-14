require("dotenv").config({ path: ".env.production" });
const express = require("express");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator/check");
const { mongoose } = require("./db/mongoose");
const { Temp } = require("./models/temp");
const { NetworkSpeed, NetworkAddress } = require("./models/network");
const { ISSLocation } = require("./models/issLocation");
const { User } = require("./models/user");
const Jaysonic = require("jaysonic");

const { devSeedData } = require("./tests/seed/devSeedData");
const { findAllData } = require("./functions/findData");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const path = require("path");

const port = process.env.PORT || 3000;
const app = express();

const publicPath = path.join(__dirname, "..", "public");

app.use(express.static(publicPath));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

/** websocket stuff
 *
 *
 */

const server = new Jaysonic.server.ws({ port: 9999 });
server.listen().then(() => {
  server.method("get.temp", () => {
    return new Promise((resolve, reject) => {
      let data = [];
      Temp.find()
        .then((doc) => {
          return new Promise((resolve, reject) => {
            doc.map((dataset, idx, arr) => {
              Temp.aggregate([{ $match: dataset }])
                .unwind("values")
                .sort({ "values.createdAt": -1 })
                .limit(1)
                .then((doc) => {
                  data.push({
                    ...doc[0],
                    values: {
                      ...doc[0].values,
                      createdAt: doc[0].values.createdAt
                    }
                  });
                  if (data.length === arr.length) {
                    resolve(data);
                  }
                })
                .catch((error) => {
                  reject(error["message"]);
                });
            });
          });
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });

  server.method("get.data", () => {
    return new Promise((resolve, reject) => {
      findAllData()
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
});

/**
 *
 */

// GET /api/temp/all
// get all temperature values in collection
app.get("/api/temp/all", (request, response) => {
  const limit = request.query.limit
    ? {
        values: {
          $slice: parseInt(request.query.limit)
        }
      }
    : {};
  Temp.find({}, limit)
    .then((doc) => {
      response.send(doc);
    })
    .catch((error) => {
      response.status(400).send({ error: error["message"] });
    });
});

// GET /api/temp
// get the most recent temperature value
app.get("/api/temp", (request, response) => {
  let data = [];
  Temp.find()
    .then((doc) => {
      return new Promise((resolve, reject) => {
        doc.map((dataset, idx, arr) => {
          Temp.aggregate([{ $match: dataset }])
            .unwind("values")
            .sort({ "values.createdAt": -1 })
            .limit(1)
            .then((doc) => {
              data.push({
                ...doc[0],
                values: {
                  ...doc[0].values,
                  createdAt: doc[0].values.createdAt
                }
              });
              if (data.length === arr.length) {
                resolve(data);
              }
            })
            .catch((error) => {
              return response.status(400).send({ error: error["message"] });
            });
        });
      });
    })
    .then((data) => {
      response.status(200).send({ data });
    })
    .catch((error) => {
      return response.status(400).send({ error: error["message"] });
    });
});

// POST /api/data
// post the generic data to be read in by the dashboard
app.post(
  "/api/data",
  [
    check("type")
      .exists()
      .isString(),
    check("data").exists()
  ],
  (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response
        .status(422)
        .send({ errors: errors.array({ onlyFirstError: true }) });
    }

    const date = new moment();
    let Data = null;

    switch (request.body.description) {
      case "network speed":
        Data = NetworkSpeed;
        break;
      case "network address":
        Data = NetworkAddress;
        break;
      case "iss location":
        Data = ISSLocation;
        break;
      default:
        return response
          .status(400)
          .send({ error: "data type model does not exist" });
    }

    const data = Data.updateOne(
      {},
      {
        type: request.body.type,
        description: request.body.description,
        data: {
          createdAt: date.format("YYYY-MM-DDTHH:mm:ss"),
          values: request.body.data
        }
      },
      { upsert: true }
    );

    data
      .then((doc) => {
        console.log(`Received data: ${JSON.stringify(request.body)}`);
        response.status(200).send({ error: null, body: request.body });
        findAllData()
          .then((result) => {
            server.notify("update.data", result);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        response.status(400).send({ error: error["message"] });
      });
  }
);

// GET /api/data
// get the generic data
app.get("/api/data", (request, response) => {
  switch (request.query.data) {
    case "ip":
      NetworkAddress.find()
        .then((doc) => {
          response.send(doc[0]);
        })
        .catch((error) => {
          response.status(400).send({ error: error["message"] });
        });
      break;
    case "netspeed":
      NetworkSpeed.find()
        .then((doc) => {
          response.send(doc[0]);
        })
        .catch((error) => {
          response.status(400).send({ error: error["message"] });
        });
      break;
    case "all":
      findAllData()
        .then((result) => {
          response.send(result);
        })
        .catch((error) => {
          response.status(400).send({ error: error["message"] });
        });
      break;
    default:
      return response.status(404).send({ error: "no such data type" });
  }
});

// POST /api/temp
// post the temperature data
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
      .then((doc) => {
        console.log(`Received Temperature ${JSON.stringify(request.body)}`);
        response.status(200).send("OK");
        let data = [];
        Temp.find()
          .then((doc) => {
            return new Promise((resolve, reject) => {
              doc.map((dataset, idx, arr) => {
                Temp.aggregate([{ $match: dataset }])
                  .unwind("values")
                  .sort({ "values.createdAt": -1 })
                  .limit(1)
                  .then((doc) => {
                    data.push({
                      ...doc[0],
                      values: {
                        ...doc[0].values,
                        createdAt: doc[0].values.createdAt
                      }
                    });
                    if (data.length === arr.length) {
                      resolve(data);
                    }
                  })
                  .catch((error) => {
                    console.log(error["message"]);
                  });
              });
            });
          })
          .then((data) => {
            server.notify("update.temp", data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
);

// POST /api/register
// Register a user
app.post(
  "/api/register",
  check("key")
    .equals(process.env.REGISTER_KEY)
    .withMessage("invalid key"),
  (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response
        .status(422)
        .send({ errors: errors.array({ onlyFirstError: true }) });
    }
    const userData = _.pick(request.body, ["username", "email"]);
    let user = new User();
    user.username = userData.username;
    user.email = userData.email;
    user.setPassword(request.body.password);

    user.save((error, User) => {
      if (error) {
        console.log(error["message"]);
        return response.status(400).json({
          message: "failed to add user",
          reason: error["message"]
        });
      } else {
        return response.status(201).json({
          message: "user added successfully"
        });
      }
    });
  }
);

// POST /api/verify
// verify token being used
app.post("/api/verify", verifyToken, (request, response) => {
  jwt.verify(request.token, "secretkey", (error, authData) => {
    if (error) {
      return response.status(403).json({
        message: "unauthorized"
      });
    } else {
      return response.json({
        authorized: true,
        authData
      });
    }
  });
});

function verifyToken(request, response, next) {
  // get auth header
  const bearerHeader = request.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    request.token = token;
    next();
  } else {
    return response.status(403).json({
      message: "unauthorized"
    });
  }
}

// POST /api/login
// Login handling for users
app.post("/api/login", (request, response) => {
  User.findOne(
    {
      username: {
        $regex: new RegExp(request.body.username)
      }
    },
    (error, user) => {
      if (user === null) {
        return response.status(400).json({
          message: "user not found"
        });
      } else {
        if (user.validPassword(request.body.password)) {
          return jwt.sign(
            { user },
            process.env.SECRET,
            { expiresIn: "15m" },
            (error, token) => {
              response.json({
                token
              });
            }
          );
        }
        return response.status(400).json({
          message: "incorrect password"
        });
      }
    }
  );
});

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
    response.sendFile(path.join(publicPath, "index.html"));
  });
});

module.exports = { app };
