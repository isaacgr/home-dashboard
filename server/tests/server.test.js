const expect = require("expect");
const request = require("supertest");

const { app } = require("../server");
const { mongoose } = require("../db/mongoose");

const { temps, populateTemps } = require("./seed/seed");

beforeEach(populateTemps);

let server = null;

beforeAll(done => {
  server = app.listen(done);
});

afterAll(done => {
  mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
  server.close(done);
});

describe("POST /api/temp", () => {
  it("should create new temp dataset", done => {
    const body = {
      loc: "test room",
      temp: 23,
      humid: 30,
      temp_f: 73,
      key: "secretsauce"
    };
    request(app)
      .post("/api/temp")
      .send(body)
      .set("content-type", "application/json")
      .expect(200)
      .expect(response => {
        expect(response.text).toBe("OK");
      })
      .end(done);
  });
  it("should reject invalid key", done => {
    const body = {
      loc: "test room",
      temp: 23,
      humid: 30,
      temp_f: 73,
      key: ""
    };
    request(app)
      .post("/api/temp")
      .send(body)
      .set("content-type", "application/json")
      .expect(422)
      .expect(response => {
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "invalid key"
            })
          ])
        );
      })
      .end(done);
  });
  it("should reject if missing params", done => {
    const body = {
      loc: "test room",
      humid: 30,
      temp_f: 73,
      key: "secretsauce"
    };
    request(app)
      .post("/api/temp")
      .send(body)
      .set("content-type", "application/json")
      .expect(422)
      .expect(response => {
        expect(response.body.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              msg: "Invalid value"
            })
          ])
        );
      })
      .end(done);
  });
});

describe("GET /api/temp", () => {
  it("should return a single document", done => {
    request(app)
      .get("/api/temp")
      .expect(200)
      .expect(response => {
        expect(response.body["data"].length).toBe(2);
        expect(response.body["data"][1]["values"]).toMatchObject({
          temp: 30,
          temp_f: 78,
          humid: 60,
          _id: expect.any(String),
          createdAt: expect.any(String)
        });
        expect(response.body["data"][0]["values"]).toMatchObject({
          temp: 23,
          temp_f: 72,
          humid: 30,
          _id: expect.any(String),
          createdAt: expect.any(String)
        });
      })
      .end(done);
  });
});

describe("GET /api/temp/all", () => {
  it("should return all documents", done => {
    request(app)
      .get("/api/temp/all")
      .expect(200)
      .expect(response => {
        expect(response.body.length).toBe(2);
      })
      .end(done);
  });
  it("should return documents with one value", done => {
    request(app)
      .get("/api/temp/all?limit=1")
      .expect(200)
      .expect(response => {
        expect(response.body.length).toBe(2);
        expect(response.body[0]["values"].length).toBe(1);
        expect(response.body[1]["values"].length).toBe(1);
      })
      .end(done);
  });
});

describe("POST /register", () => {
  it("should return success message", done => {
    const body = {
      username: "irowell",
      email: "irowell@evertz.com",
      password: "testicles"
    };
    request(app)
      .post("/register")
      .send(body)
      .expect(201)
      .expect(response => {
        expect.objectContaining({
          message: "user added successfully"
        });
      })
      .end(done);
  });
});

describe("POST /login", () => {
  it("should return success message", done => {
    const body = {
      username: "irowell",
      email: "irowell@evertz.com",
      password: "testicles"
    };
    request(app)
      .post("/login")
      .send(body)
      .expect(200)
      .expect(response => {
        expect.objectContaining({
          token: expect.any(String)
        });
      })
      .end(done);
  });
});
