import mongoose from "mongoose";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";


// REMOVE THE API KEY AND SECRET BEFORE COMMITTING

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



export const signup = async (req , res)=>{
    const {fullName , email , password} = req.body;
   try{
         if(!fullName || !email || !password){
            return res.status(400).json({ message: "All fields are required"});
        }

       if(password.length<6){
        return res.status(400).json({ message: "Password must be atleast 6 characters long"});
       }

       const user = await User.findOne({email});
       if(user) return res.status(400).json({ message: "User already exists"});
       
       const salt = await bcrypt.genSalt(10);
       const hashPassword = await bcrypt.hash(password,salt);

       const newUser = new User({
        fullName,
        email,
        password: hashPassword
       })
    if(newUser){
        generateToken(newUser._id, res);
        await newUser.save();
        
        res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        })

        
    }else{
        return res.status(400).json({ message: "User not created"});
    }
   }catch(error){
    console.log("Signup error:", error.message);
    res.status(500).json({message: "Server error"});
    
   }

   
};

export const login = async(req , res)=>{
    const{email , password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid credentials"});
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) return res.status(400).json({message:"invalid credentials"});
        generateToken(user._id, res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        });

    }catch(error){
        console.log("Error in login controller", error.message);
        res.status(500).json({messsage:"Internal server error"});

    };

   

};

export const logout = (req , res)=>{
    
   try{
    res.cookie("jwt", "" , {maxAge:0});
    res.status(201).json({message:"Logged out"});
   }catch(error){
    console.log("Error in logout controller", error.message);
    res.status(500).json({message:"Internal server error"});
   }

};


export const updateProfile = async( req, res)=>{

    try{
        const { profilePic}= req.body; // destructuring the profilePic from req.body
        const userId = req.user._id;

        if(!profilePic) return res.status(400).json({message:"Profile pic is required"}); // no dp their , pf needed for updatation 

        const uploadResponse = await cloudinary.uploader.upload(profilePic,
            {
            
            allowed_formats: ["jpg", "png", "jpeg", "gif"],
            folder: "profile_pics",
            }

        ); //uploading the image to cloudinary

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {profilePic:uploadResponse.secure_url}, 
            {new:true} // to get the updated user
        ).select("-password"); // to not send the password in response

        res.status(200).json(updatedUser);

    }catch(error){
        console.log("Error in updateProfile controller", error.message);

        if (error.message.includes("invalid image")) {
            return res.status(400).json({message: "Invalid image format"});
        }

        res.status(500).json({
            message: "Failed to update profile picture",
            error : process.env.NODE_ENV === "development" ? error.message :'Internal server error',
        });
        
    }

};

export const CheckAuth = ( req , res)=>{
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in checkauth controller", error.message);
        res.status(500).json({message:"Invalid token"});
    }
};
 