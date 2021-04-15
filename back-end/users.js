const express = require("express");
const mongoose = require("mongoose");
const argon2 = require("argon2");

const router = express.Router();

const tutors = require("./tutors.js");
const Tutor = tutors.model;

/********************
 *   User Methods   *
 *******************/

// This is the schema. Users have usernames and passwords. We solemnly promise to
// Schema for users
const userSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.ObjectId,
    ref: "Tutor",
  },
  name: String,
  email: String,
  age: String,
  state: String,
  username: String,
  password: String,
  editUsers: Boolean,
  saveEdit: String,
});

// This is a hook that will be called before a user record is saved,
// allowing us to be sure to salt and hash the password first.
userSchema.pre("save", async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // generate a hash. argon2 does the salting and hashing for us
    const hash = await argon2.hash(this.password);
    // override the plaintext password with the hashed one
    this.password = hash;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// This is a method that we can call on User objects to compare the hash of the
// password the browser sends with the has of the user's true password stored in
// the database.
userSchema.methods.comparePassword = async function (password) {
  try {
    // note that we supply the hash stored in the database (first argument) and
    // the plaintext password. argon2 will do the hashing and salting and
    // comparison for us.
    const isMatch = await argon2.verify(this.password, password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

// This is a method that will be called automatically any time we convert a user
// object to JSON. It deletes the password hash from the object. This ensures
// that we never send password hashes over our API, to avoid giving away
// anything to an attacker.
userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

// create a User model from the User schema
const User = mongoose.model("User", userSchema);

/* Middleware */

// middleware function to check for logged-in users
// eslint-disable-next-line no-unused-vars
const validUser = async (req, res, next) => {
  if (!req.session.userID)
    return res.status(403).send({
      message: "not logged in",
    });
  try {
    const user = await User.findOne({
      _id: req.session.userID,
    });
    if (!user) {
      return res.status(403).send({
        message: "not logged in",
      });
    }
    // set the user field in the request
    req.user = user;
  } catch (error) {
    // Return an error if user does not exist.
    return res.status(403).send({
      message: "not logged in",
    });
  }

  // if everything succeeds, move to the next middleware
  next();
};

// Create a user
router.post("/:tutorID/users", async (req, res) => {
  try {
    let tutor = await Tutor.findOne({ _id: req.params.tutorID });
    if (!tutor) {
      return res.sendStatus(404);
    }
    let user = new User({
      tutor: tutor,
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      state: req.body.state,
      editUsers: req.body.editUsers,
      saveEdit: req.body.saveEdit,
    });
    await user.save();
    return res.send(user);
  } catch (error) {
    console.log(`${error} at line: ${error.lineNumber}`);
    return res.sendStatus(500).send({
      message: `Error: ${error} at line: ${error.lineNumber}`,
    });
  }
});

// Get users belonging to a tutor
router.get("/:tutorID/users", async (req, res) => {
  try {
    let tutor = await Tutor.findOne({ _id: req.params.tutorID });
    if (!tutor) {
      return res.sendStatus(404);
    }
    let users = await User.find({ tutor: tutor });
    return res.send(users);
  } catch (error) {
    console.log(`${error} at line: ${error.lineNumber}`);
    return res.sendStatus(500).send({
      message: `Error: ${error} at line: ${error.lineNumber}`,
    });
  }
});

// Update user info
router.put("/:tutorID/users/:userID", async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.params.userID,
      tutor: req.params.tutorID,
    });
    if (!user) {
      return res.sendStatus(404);
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.age = req.body.age;
    user.state = req.body.state;
    user.editUsers = req.body.editUsers;
    user.saveEdit = req.body.saveEdit;
    await user.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(`${error} at line: ${error.lineNumber}`);
    return res.sendStatus(500).send({
      message: `Error: ${error} at line: ${error.lineNumber}`,
    });
  }
});

// Delete the user
router.delete("/:tutorID/users/:userID", async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.params.userID,
      tutor: req.params.tutorID,
    });
    if (!user) {
      return res.sendStatus(404);
    }
    await user.delete();

    return res.sendStatus(200);
  } catch (error) {
    console.log(`${error} at line: ${error.lineNumber}`);
    return res.sendStatus(500).send({
      message: `Error: ${error} at line: ${error.lineNumber}`,
    });
  }
});

module.exports = {
  model: User,
  routes: router,
};