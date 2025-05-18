const express = require("express");
const { check } = require("express-validator");
const {registerUser,loginUser,updateUser,deleteUser} = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.post(
    "/login",[
        check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
        check("password").notEmpty().withMessage("Password is required"),
    ],loginUser
);

userRouter.post(
    "/register",[
        check("name").notEmpty().withMessage("Name is required"),
        check("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
        check("password").notEmpty().withMessage("Password is required"),
    ],registerUser
);

userRouter.patch("/update/:id", updateUser); 
userRouter.delete("/delete/:id", deleteUser);

module.exports=userRouter;