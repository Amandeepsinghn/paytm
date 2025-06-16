const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { JWT_SECRET } = require("../config.js");

const signUpSchema = zod.object({
  userName: zod.string({ required_error: "full name is required" }),
  firstName: zod.string({ required_error: "first name is require" }),
  lastName: zod.string({ required_error: "last name is required" }),
  password: zod.string({ required_error: "password is required" }),
});

router.post("/signup", async (req, res) => {
  const { success } = signUpSchema.safeParse(req.body);

  if (!success) {
    return res.status(500).json({
      message: "data is not in the correct format",
    });
  }
  const response = await User.findOne({
    username: req.body.userName,
  });

  if (response) {
    return res.status(411).json({
      message: "Email already taken",
    });
  }

  const user = await User.create({
    username: req.body.userName,
    firstName: req.body.firstName,
    password: req.body.password,
    lastName: req.body.lastName,
  });

  const userIndentity = user._id;

  await Account.create({
    userId: userIndentity,
    balance: 1 + Math.random() * 1000,
  });

  const userId = user._id;

  return res.status(200).json({
    message: "User created successsfully",
    token: jwt.sign({ userId }, JWT_SECRET),
  });
});

router.post("/sigin", async (req, res) => {
  const { username, password } = req.body;

  const response = User.findOne({
    username: username,
    passsword: password,
  });

  const userId = response._id;

  if (response) {
    return res.status(200).json({
      token: jwt.sign({ userId }, JWT_SECRET),
    });
  } else {
    res.status(200).json({
      message: "user already exsist",
    });
  }
});

router.get("/bulk", async (req, res) => {
  const name = req.query.filter || "";

  const users = await User.find({
    $or: [{ firstName: { $regex: name } }, { lastName: { $regex: name } }],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      _id: user._id,
    })),
  });
});

module.exports = { userRouter: router };
