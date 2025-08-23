import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../utils/constant";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Rating from "react-rating-stars-component";
import { toast } from "react-toastify";


function MyPG() {
    const [recentBooking, setRecentBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewForm, setShowReviewForm] = useState(false); // Modal visibility state
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState({ rating: 0, comment: "" });
    const [rating, setRating] = useState(0);

    const { user ,token} = useSelector((store) => store.auth);
    const userId = user._id;

    useEffect(() => {
        const fetchRecentBooking = async () => {
            try {
                const response = await axios.get(`${url}/booking/getRecent`, {
                    params: { userId },
                });
                setRecentBooking(response.data.recentBooking);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching recent booking:", err);
                setError("Failed to load recent booking.");
                setLoading(false);
            }
        };

        fetchRecentBooking();
    }, [userId]);

    if (loading) {
        return <p className="text-center mt-40 text-xl font-semibold">Loading dashboard...</p>;
    }

    if (error) {
        return <p className="text-center mt-40 text-xl font-semibold text-red-500">{error}</p>;
    }

    if (!recentBooking) {
        return <p className="text-center mt-40 text-xl font-semibold">No recent booking found!</p>;
    }

    // Calculate remaining time
    const now = new Date();
    const expiryDate = new Date(recentBooking.expiryDate);
    const timeRemaining = Math.max(
        0,
        Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)) // Convert milliseconds to days
    );
    const status = new Date(recentBooking.expiryDate) > now ? "Active" : "Expired"
    const onRatingChange = (newRating) => {
        setRating(newRating);
        setReview({...review,rating:newRating});
    };
    const onChangeHandler = (e) => {
        console.log(e.target.name);
        
        const{name,value}=e.target;
        setReview({...review,[name]:value});
    };
    const handleSubmitReview = async () => {
        try {
            const res=await axios.post(`${url}/user/getPG/${recentBooking.pg._id}/review`, {...review,userId:user._id},{
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`,
                },
            });
            console.log(res);
            
            if(res.data.success){
                setReviews([...reviews, res.data.review]);
                setReview({ rating:0,comment: ""});
                setRating(0);
                setShowReviewForm(false);
                toast.success(res.data.message)
            }else{
                console.log("Failed to submit review:", res.data);
            }
        }catch(err){
            console.error("Error submitting review:", err);
            alert("Failed to submit review. Please try again.");
        }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-3xl sm:text-4xl mt-12 font-bold text-gray-800 relative inline-block">
                    My PG Dashboard
                    <span className="absolute left-0 right-0 mx-auto bottom-[-8px] h-1 w-20 bg-blue-500 rounded-md"></span>
                </h1>
            </div>
            <motion.div
                className="bg-white mt-6 rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
            >
                <img
                    src={`${url}/pg/${recentBooking.pg.photo}` || "default-image-url.jpg"} // Replace with fallback image
                    alt="PG"
                    className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="p-6 bg-gray-200">
                    <div className="flex items-center justify-between flex-wrap">
                        <h2 className="text-2xl sm:text-3xl font-bold">{recentBooking.pg.name}</h2>
                        <span
                            className={`text-sm sm:text-lg md:text-xl font-semibold px-4 sm:px-6 py-1 rounded-full border-2 tracking-wide ${
                                status === "Active"
                                    ? "border-green-500 bg-white text-green-500"
                                    : "border-red-500 bg-white text-red-500"
                            }`}
                        >
                            {status}
                        </span>
                    </div>
                    <p className="text-sm sm:text-lg text-gray-600 mt-2">
                        Address: {recentBooking.pg.address.street}, {recentBooking.pg.address.city}
                    </p>
                    <p className="text-sm sm:text-lg text-gray-600">University: {recentBooking.pg.university}</p>
                    <p className="text-sm sm:text-lg text-gray-600 mt-4">
                        Time Remaining:{" "}
                        <span className="font-semibold">
                            {timeRemaining > 0 ? `${timeRemaining} days` : "Expired"}
                        </span>
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 space-y-4 md:space-y-0">
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold">Owner Contact:</h3>
                            <p className="text-sm sm:text-lg text-gray-600">Phone: {recentBooking.pg.contact.phone}</p>
                            <p className="text-sm sm:text-lg text-gray-600">Email: {recentBooking.pg.contact.email}</p>
                        </div>
                        <div className="flex space-x-4">
                            <motion.button
                                className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2 px-2 sm:px-6 rounded-full transition duration-300"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowReviewForm(true)}
                            >
                                Write a Review
                            </motion.button>
                            <motion.button
                                className="border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white py-2 px-4 sm:px-6 rounded-full transition duration-300"
                                whileTap={{ scale: 0.95 }}
                            >
                                Contact Owner
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Review Form Modal */}
            {showReviewForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
                        <div>
                            <label className="block text-gray-700 font-semibold">Rating :</label>
                            <Rating
                                count={5}
                                value={rating}
                                size={32}
                                activeColor="#ffd700"
                                onChange={onRatingChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Comment :</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-2"
                                rows="4"
                                name="comment"
                                value={review.comment}
                                onChange={onChangeHandler}
                            ></textarea>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                                onClick={() => setShowReviewForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                onClick={handleSubmitReview}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyPG;
