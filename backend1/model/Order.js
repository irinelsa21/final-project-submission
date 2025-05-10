const mongoose = require("mongoose");

const orderSchema =  mongoose.Schema({
 cartItems: [
    {
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  shippingInfo: {
    name: String,
    address: String,
    city: String,
    phone: String,
    state: String,
    country:String,
  },
  paymentMethod: String,
  paymentDetails: Object,
  totalPrice: Number,
  status: {
    type: String,
    default: "Pending", // or "Processing", "Delivered", etc.
  },
  orderDate: {
    type: Date,
    default: Date.now,
  }
});
var OrderModel=mongoose.model("Order",orderSchema)
module.exports=OrderModel