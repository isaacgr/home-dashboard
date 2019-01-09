const expect = require("expect");
const request = require("supertest");

const { app } = require("../server");
const { mongoose } = require("../db/mongoose");

const { Temp } = require("../models/temp");

let server = null;

beforeAll(done => {
  server = app.listen(done);
});

afterAll(done => {
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
});
