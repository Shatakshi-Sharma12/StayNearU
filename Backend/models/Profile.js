import mongoose from "mongoose";

const profileSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    parent:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    photo: { type: String },
    aadharCard: { type: String, required: true },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    bookings:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Booking'
        }
    ]
},{timestamps:true})

const Profile=mongoose.model.Profile||mongoose.model('Profile',profileSchema);
export default Profile;















// import fs from "fs";
// import Profile from "./models/profile.js";

// const saveProfileWithAadhar = async () => {
//     const pdfData = fs.readFileSync("path/to/aadhar-card.pdf"); // Read the PDF file
//     const profile = new Profile({
//         name: "John Doe",
//         email: "john@example.com",
//         phone: 1234567890,
//         age: 30,
//         gender: "Male",
//         parent: "Jane Doe",
//         address: "123 Main Street",
//         photo: "profile.jpg",
//         aadharCard: {
//             data: pdfData,
//             contentType: "application/pdf",
//         },
//     });

//     await profile.save();
//     console.log("Profile with Aadhaar card saved successfully!");
// };

// saveProfileWithAadhar();
