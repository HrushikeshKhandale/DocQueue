const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.ObjectId,
  },
  p_name: {
    type: String,
    required: true,
  },
  p_email: {
    type: String,
    required: true,
  },
  p_password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
