import cron from 'node-cron'
import Booking from './models/Booking.js';
import Room from './models/Room.js';
cron.schedule('* * * * *', async () => {
    try {
        const expiredBookings = await Booking.find({
            expiryDate: { $lte: new Date() },
            status: { $ne: "Expired" },
        });

        console.log(expiredBookings);

        for (const booking of expiredBookings) {
            const roomData = await Room.findById(booking.rooms);
            console.log(roomData);

            if (!roomData) {
                console.error(`Room with ID ${booking.rooms} not found.`);
                continue;
            }
            const roomType = roomData.rooms.find(r => r._id.toString() === booking.roomId.toString());
            console.log(roomType);

            if (roomType) {
                roomType.available += 1;
                
                // Explicitly mark the array as modified
                roomData.markModified('rooms');

                await roomData.save();
            } else {
                console.error(`Room type with ID ${booking.roomId} not found.`);
            }
            booking.status = "Expired";
            await booking.save();
        }

        console.log("Processed expired bookings:", expiredBookings.length);
    } catch (error) {
        console.error("Error processing expired bookings:", error);
    }
});
