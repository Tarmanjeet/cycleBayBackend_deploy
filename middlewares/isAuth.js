const jwt=require("jsonwebtoken");

const isAuth=async(req,res,next)=>{
    const token=req.header("Authorization");
    if(!token){
        return res.status(401).json({success:false,message:"Unauthorized"});
    }
    try{
        const decoded=jwt.verify(token,process.env.token_secret);
        req.user=decoded;
        next();
    }catch(err){
        return res.status(401).json({success:false,message:"Unauthorized"});
    }
}

module.exports=isAuth;