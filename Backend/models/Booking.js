import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
    profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
    },
    pg:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PG",
        required:true
    },
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
    },
    rooms:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
    },
    bookingDate:{
        type:Date,
        required:true,
    },
    expiryDate:{
        type:Date,
        required:true,
    },
    month:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        enum: ["Confirm", "Pending","Expired"],
        default: "Available"
    },
    transactionId:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{timestamps:true})

const Booking=mongoose.model.Booking||mongoose.model('Booking',bookingSchema);
export default Booking;