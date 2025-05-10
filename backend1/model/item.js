

const mongoose = require('mongoose');

var itemSchema=mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String 
});
var ItemModel=mongoose.model("item",itemSchema)
module.exports=ItemModel