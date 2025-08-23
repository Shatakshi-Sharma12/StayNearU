import mongoose from "mongoose";

const pgSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please enter the name of the PG"]
    },
    address: {
        street: { type: String, required: [true, "Please enter the street address"] },
        city: { type: String, required: [true, "Please enter the city"] },
        state: { type: String, required: [true, "Please enter the state"] },
        pincode: { type: Number, required: [true, "Please enter the pincode"] },
        latitude:{
            type:Number,
            required:[true,"Please enter the latitude"]
        },
        longitude:{
            type:Number,
            required:[true,"Please enter the longitude"]
        }
    },
    university:{
        type: String,
        required: [true, "Please enter the university name"]
    },
    distance:{
        type: String,
        required: [true, "Please enter the distance from the nearest university"]
    },
    rooms:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room'
        },
    facilities: {
        type: [String],
        required: [true, "Please add facilities"]
    },
    photo: {
        type: String,
        trim: true
    },
    contact: {
        phone: { type: Number, required: [true, "Please provide a contact number"] },
        email: { type: String, required: [true, "Please provide a contact email"] }
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}, { timestamps: true });

const PG = mongoose.models.PG || mongoose.model('PG', pgSchema);

export default PG;
