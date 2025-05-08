const mongoose=require("mongoose");

const mongoUrl="mongodb+srv://cyclebay:xJlMX7gwQVqdXhfl@cluster0.2zcpzam.mongodb.net/cyclebay";
mongoose.connect(mongoUrl)
.then(()=>console.log("Connected to Database"))
.catch((err)=>console.log("Error connecting to database",err));