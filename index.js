const express=require("express");
const bodyParser=require("body-parser");
const dotenv=require("dotenv").config();
const userRouter=require("./routes/user.router");
const productRouter=require("./routes/product.router");
//const orderRouter=require("./routes/order.router");
const connection=require("./db/connection");
const path = require("path");
const cors = require('cors')

const app=express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use("/user",userRouter);
app.use("/product",productRouter);
//app.use("/order",orderRouter);

app.use("/",(req,res)=>{
    res.status(200).send("Application is running");
})
app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname,"/404.html"));
})
app.listen(3000,(err)=>{
    if(err) console.log("err",err);
    console.log("server listening on 3000");
})