import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
    rating:{
        type:Number,
        min:0,
        max:5,
        required:true,
    },
    comment:{
        type:String,
        trim:true,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    postedAt:{
        type:Date,
        default:Date.now
    }
})

const Review=mongoose.model.Review || mongoose.model('Review',reviewSchema);

export default Review;