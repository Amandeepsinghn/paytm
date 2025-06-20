const { default: mongoose } = require("mongoose");
const { float32 } = require("zod/v4");

mongoose.connect("*******");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
});

const bankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  balance: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", bankSchema);

module.exports = {
  User,
  Account,
};
