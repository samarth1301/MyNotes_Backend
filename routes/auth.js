const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt= require("jsonwebtoken");
const fetchuser = require('../middleware/fetchuser');
// creating a new user using POST "/api/auth/createuser" no login required

    router.post("/createuser",[
        body('name','enter a valid name').isLength({min:3}),
        body('email','enter a valid mail').isEmail(),
        body('password').isLength({min:5}),

    ],async (req,res)=>{
        //if there are errors, return bad requests errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }
        try{

                //check ehether the user with this email exists already
        let user= await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: "Sorry a user with this email already exists"});
        }
        const salt= await bcrypt.genSalt(10);

        const secPass= await bcrypt.hash(req.body.password,salt);
        user= await User.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber:req.body. phoneNumber,
            password: secPass,
        })
        const data={
            user:{
                id:user.id
            }
        }
        const token=  jwt.sign(data,"notebookApp",{expiresIn:"2h"});
        res.json({token});
    }
    catch(e){
        return res.status(500).json({error: e.message});
    }
        
    });


    //authenticate a user usinug /api/auth/login    no ligin required


    router.post("/login",[
        body('email','enter a valid mail').isEmail(),
        body('password','can not be blank').isLength({min:5}),

    ],async (req,res)=>{
         //if there are errors, return bad requests errors
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
         }
         const {email,password} = req.body;
         try {
             let user= await User.findOne({email});
             if(!user){
                 return res.status(401).json({error: "sorry user does not exist"});
                }
                const passwordCompare= await bcrypt.compare(password,user.password);
                
                if(!passwordCompare){
                    return res.status(400).json({error: "Please enter correct password"});

                }
                const data={
                    user:{
                        id:user.id
                    }
                }
                const token=  jwt.sign(data,"notebookApp",{expiresIn:"2h"});
                res.json({token});

         } catch(error) {
             res.status(500).json({error: error.message});
         }
    });
    //get user detail login required /api/auth/getuser 
    router.get("/getuser", fetchuser ,async (req,res)=>{
         
         
         try {
             userId= req.user.id;
             let user= await User.findById(userId).select("-password");
                res.json(user);

         } catch (error) {
             res.status(500).json({error: error.message});
         }
    });

module.exports= router;