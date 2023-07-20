const express=require("express")
const {UserModel}=require("../Model/user.model")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
const {name,email,gender,password}=req.body
try {
    bcrypt.hash(password, 5,async(err, hash)=>{
        if(err){
            res.status(500).send("something went wrong")
        }
        if(hash){
            const user=new UserModel({name,email,gender,password:hash})
            await user.save()
            res.status(200).send({"msg":"Registration has been done!"})
        } 
    });
} catch (error) {
    res.status(400).send({"msg":error.message})
}
})


userRouter.post("/login",async(req,res)=>{
const{email,password}=req.body
try {
    const user=await UserModel.findOne({email})
   if(user){
    bcrypt.compare(password, user.password,async(err, result)=> {
        if(result){
            res.status(200).send({"msg":"login successfull","token":jwt.sign({"userID":user._id},"masai")})
        }else{
            res.status(400).send({"msg":"Wrong credentials"})
        }
      
    });
    //console.log(user)
   }
} catch (error) {
    res.status(400).send("Wrong Credentials")
}
})









module.exports={userRouter}