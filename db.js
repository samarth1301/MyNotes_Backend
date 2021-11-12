const mongoose = require('mongoose');
require("dotenv").config();


const mongoURI=process.env.DB_key;


const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("DB connected succesfully");
    });
}

module.exports= connectToMongo;

