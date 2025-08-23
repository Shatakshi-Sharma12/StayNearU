import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,"Please enter your name!"]
    },
    email:{
        type:String,
        trim:true,
        required:[true,"Please enter your Email!"],
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    userType: {
        type: String,
        enum: ['student', 'pgOwner'],
        required: [true, "Please specify user type!"]
    },
},{minimize:false});

const User=mongoose.model.User||mongoose.model('User',userSchema);

export default User;