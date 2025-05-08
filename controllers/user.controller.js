const {validationResult}=require("express-validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const users=require("../db/models/userSchema");

let registerUser=async(req,res)=>{
    let errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,message:errors.array()[0].msg});
    }
    let body=req.body;
    let existingUser=await users.findOne({email:body.email});
    if(existingUser && Object.keys(existingUser).length){
        return res.status(400).json({success:false,message:"User already exists"});
    }
    const salt=await bcrypt.genSalt(10);
    let newUser=new users({
        name:body.name,
        email:body.email,
        password:await bcrypt.hash(body.password,salt),
        phone:body.phone,
        type:body.type||"U"
    })
    await newUser.save();
    if(!newUser){
        return res.status(500).json({success:false,message:"Internal server error"});
    }
    return res.status(200).json({success:true,message:"User registered successfully"});

}

const loginUser=async(req,res)=>{
    let errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,message:errors.array()[0].msg});
    }
    let {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({success:false,message:"Email and password are required"});
    }
    query={
        email:req.body.email
    }
    const user=await users.findOne(query);
    if(!user){
        return res.status(400).json({success:false,message:"User not found"});
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({success:false,message:"Invalid credentials"});
    }
    const payLoad={
        userId:user._id,
        type:user.type||0,
        name:user.name
    }
    const tokenSecret=process.env.TOKEN_SECRET;
    jwt.sign(payLoad,tokenSecret,{expiresIn:3600},
        (err,token)=>{
            if(err){
                return res.status(500).json({success:false,message:"Internal server error"});
            }
            res.json({success:true,message:"User Logged in successfully",token:token});
        }
    )

}

const updateUser=async(req,res)=>{
    let userId=req.params.id;
    let user=await users.findById(userId);

    if(!user){
        return res.status(400).json({success:false,message:"User not found"});
    }
    let newName=req.body.name;
    let newEmail=req.body.email;
    let newPassword=req.body.password;
    let newPhone=req.body.phone;
    let newType=req.body.type;
    if(newName && newName!=""){
        user.name=newName;
    }
    if(newEmail && newEmail!=""){
        user.email=newEmail;
    }
    if(newPassword && newPassword!=""){
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(newPassword,salt);
    }
    if(newPhone && newPhone!=""){
        user.phone=newPhone;
    }
    if(newType && newType!=""){
        user.type=newType;
    }
    await user.save();
    return res.status(200).json({success:true,message:"User updated successfully"})
}

const deleteUser=async(req,res)=>{
    let userId=req.params.id;
    let deletedUser=await users.findByIdAndDelete(userId);
    if(!deletedUser){
        return res.status(400).json({success:false,message:"User not found"});
    }
    return res.status(200).json({success:true,message:"User deleted successfully"});
}

module.exports={
    registerUser,
    loginUser,
    updateUser,
    deleteUser
}