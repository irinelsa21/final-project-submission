const express=require('express')
var cors = require('cors')
require("./connection.js")
var itemModel=require('./model/item.js')
var RegisterModel = require('./model/User.js');
var orderModel=require('./model/Order.js');

var app=express()
app.use(express.json());
app.use(cors());


app.post('/items',async(req,res)=>{
    try {
        await itemModel(req.body).save()
        res.send({message:"Item added successfully"})
    } catch (error) {
        console.log('error saving item',error)
        
    }
})

app.get('/items/category/:cat', async (req, res) => {
      try {
        const items = await itemModel.find({ category: req.params.cat });
        res.send(items);
      } catch (error) {
        console.log(error);
       
      }
    });
    app.get('/items', async (req, res) => {
        try {
          const items = await itemModel.find();
          res.send(items);
        } catch (error) {
          console.log(error);
          res.send("Error retrieving items");
        }
      });
      app.put('/items/:id', async (req, res) => {
        try {
          const updatedItem = await itemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
          res.send(updatedItem);
        } catch (error) {
          console.log(error);
          res.send("Error updating item");
        }
      });
      app.delete('/items/:id', async (req, res) => {
        try {
          await itemModel.findByIdAndDelete(req.params.id);
          res.send({ message: "Item deleted successfully" });
        } catch (error) {
          console.log(error);
          res.send("Error deleting item");
        }
      });

      app.post('/register',async(req,res)=>{
    try {
      await new RegisterModel(req.body).save()
      res.send({message:"Msg sended"})
      } catch(error) {
      console.log(error)
       }
  })
  app.get('/register',async(req,res)=>{
    try{
      var users=await RegisterModel.find();
      res.send(users);
   }catch(error){
       console.log(error)
    }
  })
  app.post("/orders", async (req, res) => {
  try {
    const newOrder = await orderModel.create(req.body);
    res.json({message:"order saved",newOrder});
  } catch (err) {
    console.error(err);
    res.json({ error: "Failed to save order" });
  }
});
app.get("/orders", async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.json(orders);
  } catch (err) {
    res.json({ error: "Failed to fetch orders" });
  }
});
app.patch('/orders/:id', async (req, res) => {
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.json({ error: err.message });
  }
});
app.delete("/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order cancelled" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order" });
  }
});
app.get('/',(req,res)=>{
    res.send("hello world")
})
app.listen(3005,()=>{
    console.log("Port is running at 3005")
})