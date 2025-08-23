import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../utils/constant";
import { useSelector } from "react-redux";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((store) => store.auth);
    const userId = user._id;   

    useEffect(() => {
        // Fetch booking data from the backend
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`${url}/booking/get`, {
                    params: { userId },
                });
                setBookings(response.data.bookings);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching bookings:", error);
                setError("Failed to load bookings.");
                setLoading(false);
            }
        };

        fetchBookings();
    }, [userId]);

    const calculateStatus = (bookingDate, expiryDate) => {
        const now = new Date();
        const bookingStart = new Date(bookingDate);
        const bookingEnd = new Date(expiryDate);
    
        if (now < bookingStart) {
            return "Pending";
        } else if (now >= bookingStart && now <= bookingEnd) {
            return "Activated";
        } else if (now > bookingEnd) {
            return "Expired";
        }
    };
    

    if (loading) {
        return <p className="text-center mt-40 text-xl font-semibold">Loading bookings...</p>;
    }

    if (error) {
        return <p className="text-center mt-40 text-xl font-semibold text-red-500">{error}</p>;
    }

    if (!bookings || bookings.length === 0) {
        return <p className="text-center mt-40 text-xl font-semibold">No bookings found!</p>;
    }

    return (
        <div className="bg-gradient-to-r from-blue-200 via-teal-50 to-gray-300 min-h-screen p-6">
            <div className="text-center">
                <h1 className="text-4xl mt-12 font-bold text-gray-800 relative inline-block">
                    My Bookings
                    <span className="absolute left-0 right-0 mx-auto bottom-[-8px] h-1 w-20 bg-blue-500 rounded-md"></span>
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {bookings.map((booking) => {
                    const status = calculateStatus(booking.bookingDate, booking.expiryDate); // Use bookingDate and expiryDate
                    return (
                        <div key={booking._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <img
                                src={`${url}/pg/${booking.pg.photo}` || "default-image-url.jpg"} // Replace with actual image URL or fallback
                                alt="PG Image"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 bg-gray-200">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-semibold">{booking.pg.name}</h2>
                                    <span
                                        className={`text-sm font-semibold px-2 py-1 rounded ${
                                            status === "Activated"
                                                ? "bg-green-200 text-green-800"
                                                : status === "Expired"
                                                ? "bg-red-200 text-red-800"
                                                : "bg-yellow-200 text-yellow-800"
                                        }`}
                                    >
                                        {status}
                                    </span>
                                </div>
                                <p className="text-lg text-gray-500">
                                    {booking.pg.address.street}, {booking.pg.address.city}
                                </p>
                                <p className="text-sm text-gray-400">{booking.pg.university}</p>
                                <p className="text-sm text-gray-500 mt-2">Transaction ID: {booking.transactionId}</p>
                                <p className="text-sm text-gray-500">Stayed: {booking.month} months</p>

                                {/* Contact Details */}
                                <div className="mt-4">
                                    <h3 className="font-semibold">Contact Details</h3>
                                    <p className="text-sm text-gray-600">Phone: {booking.pg.contact.phone}</p>
                                    <p className="text-sm text-gray-600">Email: {booking.pg.contact.email}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-4 mt-4">
                                    <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2 px-4 rounded-full transition duration-300">
                                        Write a Review
                                    </button>
                                    <button className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white py-2 px-4 rounded-full transition duration-300">
                                        Book Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyBookings;
