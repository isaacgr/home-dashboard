const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "cant be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
      unique: true
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "cant be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
      unique: true
    },
    hash: { type: String },
    salt: { type: String }
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator, { message: "is already taken." });

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

userSchema.methods.validPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
