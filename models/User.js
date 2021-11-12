const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema= new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,

    },
    date:{
        type: Date,
        default: Date.now
    }

});
const UserModel=mongoose.model("users",UserSchema);

module.exports = UserModel;

