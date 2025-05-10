const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email:String,
  password: String,
  SignUpTime:Date,
});
var RegisterModel=mongoose.model("User",UserSchema)
module.exports = RegisterModel