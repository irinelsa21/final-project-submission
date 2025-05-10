const mongoose = require('mongoose');

const LoginUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

var LoginModel = mongoose.model("LoginUser", LoginUserSchema);
module.exports = LoginModel;
