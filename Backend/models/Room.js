import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    rooms:[{
        type: {
            type: String,
            enum: ["Single", "Double", "Triple"],
            required: [true, "Please specify the room type"]
        },
        count: {
            type: Number,
            required: [true, "Please specify the total number of rooms"]
        },
        available: {
            type: Number,
            required: [true, "Please specify how many rooms are currently available"]
        },
        price: {
            type: Number,
            required: [true, "Please specify the price for this room type"]
        }
    }]
});

const Room=mongoose.models.Room || mongoose.model('Room',roomSchema);
export default Room;