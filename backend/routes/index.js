const express = require("express");
const router = express.Router();
const { userRouter } = require("./user.js");
const { account } = require("./account.js");
router.use("/user", userRouter);
const { authMiddleWare } = require("../middleware.js");
const zod = require("zod");
const { User } = require("../db.js");

updateSchema = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.use("/account", authMiddleWare, account);
router.put("/user", authMiddleWare, async (req, res) => {
  const { success } = updateSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Updated succesfully",
  });
});

module.exports = { mainRouter: router };
