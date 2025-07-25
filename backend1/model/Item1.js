// models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Item", itemSchema);
