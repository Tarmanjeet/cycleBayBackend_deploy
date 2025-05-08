const express=require("express");
const bodyParser=require("body-parser");
const dotenv=require("dotenv").config();
const userRouter=require("./routes/user.router");
const connection=require("./db/connection");
const path = require("path");

const app=express();
app.use(bodyParser.json());
app.use("/user",userRouter);
app.use("/",(req,res)=>{
    res.status(200).send("Application is running");
})
app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname,"/404.html"));
})
app.listen(6000,(err)=>{
    if(err) console.log("err",err);
    console.log("server listening on 6000");
})