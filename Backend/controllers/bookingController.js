import Booking from '../models/Booking.js'
import Profile from '../models/Profile.js';
import Room from '../models/Room.js';
const createBooking=async (req,res)=>{
    try {
        console.log(req.body);
        
        const {
            profile,
            room,
            months,
            pgId,
            roomId,
            userId,
            transactionId,
            paymentStatus
        } = req.body;

        if (!profile || !pgId || !roomId || !months || !transactionId || !userId) {
            console.log(profile, pgId,roomId,transactionId,months,userId);
            
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }
        console.log("yahaaaaaaa tkkkkkkkk");
        const data=await Profile.findById(profile);
        const roomData = await Room.findById(room);

        if (!roomData) {
            return res.status(404).json({
                success: false,
                message: "Room not found.",
            });
        }
        const roomType=roomData.rooms.find((r)=>r._id.toString()===roomId);
        if(!roomType){
            return res.status(404).json({
                success:false,
                message:"Room type not found.",
            });
        }
        if(roomType.available<=0){
            return res.status(400).json({
                success: false,
                message: "No available rooms of this type.",
            });
        }
        roomType.available -= 1;
        await roomData.save();
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + months);
        const newBooking = new Booking({
            profile,
            pg:pgId,
            roomId,
            rooms:room,
            bookingDate: Date.now(),
            expiryDate,
            month:months,
            transactionId,
            user:userId,
            status: paymentStatus || "Pending",
        });
        data.bookings.push(newBooking);
        await newBooking.save();
        await data.save();
        res.status(201).json({
            success: true,
            message: "Booking created successfully.",
            booking: newBooking,
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
}

const getBookings=async(req,res)=>{
    try{
        const userId=req.query.userId;
        const bookings=await Booking.find({user:userId}).populate('pg').populate('rooms');
        if(!bookings){
            return res.json({success:false,message:"You don't have any bookings!"});
        }
        return res.json({success:true,bookings});
    }catch(e){
        console.log(e);
    }
}

const getRecentBooking=async(req,res)=>{
    try{
        const { userId } = req.query;

        // Validate input
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required!",
            });
        }

        // Fetch the most recent booking for the user
        const recentBooking = await Booking.findOne({ user: userId })
            .sort({ createdAt: -1 }) // Sort by creation date in descending order
            .populate("pg") // Populate the PG reference
            .populate("rooms"); // Populate the room reference if needed

        // Check if a booking was found
        if (!recentBooking) {
            return res.status(404).json({
                success: false,
                message: "No recent booking found!",
            });
        }

        // Return the recent booking
        return res.status(200).json({
            success: true,
            recentBooking,
        });
    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching recent booking.",
        });       
    }
}

const getAdminBookings=async(req,res)=>{
    try{
        const pgId=req.params.id;
        const booking=await Booking.find({pg:pgId}).populate("profile").populate("rooms");
        if(!booking){
            return res.json({success:false,message:"Something went wrong"});
        }
        return res.json({success:true,booking});
    }catch(e){
        console.log(e);
    }
}

export {createBooking,getBookings,getRecentBooking,getAdminBookings};