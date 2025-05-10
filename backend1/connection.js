const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://irinelsa21:user@cluster0.qvhc21l.mongodb.net/regalsparkjewels?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log("connected ")
})
.catch((err)=>{
    console.log(err)
})