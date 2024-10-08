import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import dotenv from'dotenv';
dotenv.config();

export const signup=async (req,res,next)=>{
  
    const {username,email,password}=req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, 'Email already in use'));
    }
    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser=new User({username,email,password:hashedPassword})
    try{
    await newUser.save()
    res.status(201).json({msg:"user created successfully"})
    }
    catch(error){
        next(error)
    }
}

export const signin=async(req,res,next)=>{
    const {email,password}=req.body;

    try{
        const validUser=await User.findOne({email});
        if(!validUser) return next(errorHandler(404,'User not found'))

        
        const validPassword=bcryptjs.compareSync(password,validUser.password)
        if(!validPassword) return next(errorHandler(401,'Wrong Credentials'))

        const token=jwt.sign({id:validUser._id}, 'r32wefghy543ertyujht543e')
        const{password: pass , ...rest}=validUser._doc // for not to show password
        res.cookie('access_token' ,token,{httpOnly:true})
        .status(200).json(rest)

    }
    catch(error){
        next(error);
    }
}

//continue with google
export const google=async (req,res,next)=>{
    try{
        const user=await User.findOne({email:req.body.email})
        if(user){
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
            const{password: pass , ...rest}=user._doc // for not to show password
            res.cookie('access_token' ,token,{httpOnly:true})
            .status(200).json(rest)
        }else{
            const generatedPassword=Math.random().toString(36).slice(-8) +Math.random().toString(36).slice(-8); //to add a 8+8 digits password having 0-9 a-z
            const hashedPassword=bcryptjs.hashSync(generatedPassword,10);
           
            const newUser=new User({
                username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
                email:req.body.email,
                password:hashedPassword,
                avatar:req.body.photo,
            })
            await newUser.save();
            const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const{password: pass , ...rest}=newUser._doc // for not to show password
            res.cookie('access_token' ,token,{httpOnly:true})
            .status(200).json(rest)   
      }
    }
    catch(error){
        next(error);
    }
}


export const signOut=(req,res,next)=>{
    try{
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out  ');

    }catch(error){
        next(error);
    }
}