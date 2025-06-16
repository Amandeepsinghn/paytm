const express = require("express");
const router = express.Router();
const { Account, User } = require("../db.js");
const { default: mongoose } = require("mongoose");

router.get("/balance", async (req, res) => {
  const id = req.userId;

  const data = await Account.findOne({
    userId: id,
  });

  if (!data) {
    return res.status(411).json({
      message: "user account does not exsist",
    });
  }

  res.status(200).json({
    balance: data.balance,
  });
});

router.post("/transfer", async (req, res) => {
  const session = await mongoose.startSession();

  console.log("inside transfer");

  session.startTransaction();
  const { amount, to } = req.body;

  const account = await Account.findOne({
    userId: req.userId,
  });
  if (account.balance < amount) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({
    userId: to,
  }).session(session);

  if (!toAccount) {
    return res.status(400).json({
      message: "Invalid account",
    });
  }
  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  ).session(session);

  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session);

  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
  });
});

module.exports = { account: router };
