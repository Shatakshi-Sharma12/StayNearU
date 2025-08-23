import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../utils/constant";
import { FaStar, FaCheckCircle, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUniversity, FaRoute, FaBook, FaClipboardList, FaMapPin } from "react-icons/fa";
import {FiMapPin } from "react-icons/fi";
import Rating from "react-rating-stars-component";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import util from "../utils/constant"
import "leaflet/dist/leaflet.css"
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function ViewPG() {
    const { token, user } = useSelector((store) => store.auth);
    const { profile } = useSelector((store) => store.profile);
    const { id } = useParams();
    const [pgData, setPgData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState({ rating: 0, comment: "" });
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const [ratingValue, setRatingValue] = useState(0);
    const zoom=15;
    const [center,setCenter]=useState({
        lat: 37.7749,
        lng: -122.4194
    })
    const [showAllReviews, setShowAllReviews] = useState(false);
    const mapRef=useRef();
    const fetchData = async () => {
        try {
            const res = await axios.get(`${url}/user/getPG/${id}`);
            if (res.data.success) {
                console.log("hsdh");
                
                setPgData(res.data.pg);
                setReviews(res.data.pg.reviews);
                // setMainImage(res.data.pg.images[0] || "");
                setCenter({lat:res.data.pg.address.latitude,
                    lng:res.data.pg.address.longitude})
            }
            console.log(res.data);
            
            setLoading(false);
        }catch(error){
            console.error("Error fetching PG data:", error);
            setLoading(false);
        }
    };
    console.log(pgData);
    const navigate = useNavigate();

    const handleBookingClick = () => {
        if (!profile?.aadharCard || profile.aadharCard.trim() === "") {
            toast.error("Profile is not completed yet. Please update your profile first!");
            return;
        }
        navigate(`/user/pg/${pgData._id}/booking`);
    };
    useEffect(()=>{
        fetchData();
    },[id,ratingValue]);
    const onChangeHandler = (e) => {
        const{name,value}=e.target;
        setReview({...review,[name]:value});
    };
    const onRatingChange = (newRating) => {
        setRatingValue(newRating);
        setReview({...review,rating:newRating});
    };
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try{
            const res=await axios.post(`${url}/user/getPG/${id}/review`,{...review,userId:user._id},{
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`,
                },
            });
            if(res.data.success){
                setReviews([...reviews, res.data.review]);
                setReview({ rating:0,comment: ""});
                setRatingValue(0);
            }else{
                console.log("Failed to submit review:", res.data);
            }
        }catch(error){
            toast.error("Please login to submit a review!");
            setReview({ rating: 0, comment: "" });
            setRatingValue(0);
        }
    };
    // console.log(pgData.photo);
    
    const topReviews = [...reviews].sort((a, b) => b.rating - a.rating).slice(0, 3);
    return (
        <div className="mt-16 container mx-auto p-6">
            {loading ? (
                <p>Loading...</p>
            ) : pgData ? (
                <div className="flex md:flex-row flex-col-reverse">
                    {/* Left side: Images */}
                    <div className="w-full md:w-1/2 pr-4 sticky top-0">
                        <div className="flex flex-col space-y-4">
                            <img
                                src={`${url}/pg/${pgData.photo}`}
                                alt="Main PG view"
                                className="rounded-lg w-full h-80 object-cover shadow-lg mb-4 transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                        {/* Map Section */}
                        <div className="w-full pr-4 flex flex-col">
                            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                            <FiMapPin className="mr-2 text-blue-500"/>Location
                            </h2>
                            <div className="rounded-lg overflow-hidden shadow-lg">
                                <MapContainer style={{ height: '400px', width: '100%' }} center={center}
                                    zoom={zoom} ref={mapRef}>
                                    <TileLayer url={util.maptiler.url}/>
                                    <Marker position={center}>
                                        <Popup>
                                            PG Location
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        </div>
                    </div>

                    {/* Right side: PG details and reviews */}
                    <div className="w-full md:w-1/2 pl-4">
                        <h1 className="text-4xl font-bold mb-3">{pgData.name}</h1>
                        <p className="text-lg mb-2 flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-blue-500" /> {pgData.address.street}, {pgData.address.city}, {pgData.address.state}
                        </p>
                        <p className="text-lg mb-2 flex items-center">
                            <FaUniversity className="mr-2 text-blue-500" /> Nearest University: {pgData.university}
                        </p>
                        <p className="text-lg mb-2 flex items-center">
                            <FaRoute className="mr-2 text-blue-500" /> Distance: {pgData.distance} km
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                            <button
                                onClick={handleBookingClick}
                                className="bg-transparent border-2 border-blue-500 text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-colors duration-300 flex items-center"
                            >
                                <FaClipboardList className="mr-2 text-xl" />
                                Book PG
                            </button>
                        </div>
                        <hr className="my-4 border-gray-300" />
                        <h2 className="text-2xl font-semibold mt-4 mb-2">Facilities</h2>
                        <ul className="list-none space-y-2">
                            {pgData.facilities.map((facility, index) => (
                                <li
                                    key={index}
                                    className="flex items-center text-lg transition-transform duration-300 hover:translate-x-2"
                                >
                                    <FaCheckCircle className="text-blue-500 bg-gray-100 rounded-full mr-3" />
                                    {facility}
                                </li>
                            ))}
                        </ul>
                        <hr className="my-4 border-gray-300" />
                        <h2 className="text-2xl font-semibold mt-4 mb-2">Rooms Availability</h2>
                        <ul className="list-none space-y-2">
                            {pgData.rooms.rooms
                                .filter((room) => room.count > 0) // Filter out rooms with count <= 0
                                .map((room, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center text-lg transition-transform duration-300 border-2 border-color-blue p-3"
                                    >
                                        <FaCheckCircle className="text-blue-500 bg-gray-100 rounded-full mr-3" />
                                        <span className="font-semibold">{room.type}</span>
                                        <span className="ml-10 text-gray-600">@ ₹{room.price}/- per month</span>
                                        <span
                                            className={`ml-auto px-4 py-1 rounded-full text-sm font-semibold ${
                                                room.available === 0
                                                    ? 'border border-red-500 text-red-500'
                                                    : room.available <= 3
                                                    ? 'border border-yellow-500 text-yellow-500'
                                                    : 'border border-green-500 text-green-500'
                                            }`}
                                        >
                                            {room.available === 0
                                                ? 'Not Available'
                                                : room.available <= 3
                                                ? `Few remaining (${room.available} left)`
                                                : 'Available'}
                                        </span>
                                    </li>
                                ))}
                        </ul>
                        {/* Review form */}
                        <h2 className="text-2xl font-semibold mt-4 mb-2">Leave a Review</h2>
                        <form onSubmit={handleReviewSubmit} className="mb-4">
                            <Rating
                                count={5}
                                value={ratingValue}
                                size={24}
                                activeColor="#ffd700"
                                onChange={onRatingChange}
                            />
                            <textarea
                                name="comment"
                                value={review.comment}
                                onChange={onChangeHandler}
                                placeholder="Write your review here..."
                                className="w-full border rounded p-2 mb-2"
                            ></textarea>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                Submit Review
                            </button>
                        </form>

                        {/* Display top 3 reviews in row */}
                        <h2 className="text-2xl font-semibold mt-4 mb-2">Top Reviews</h2>
                        <div className="flex space-x-4 overflow-x-auto">
                            {topReviews.map((review, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-100 w-1/3">
                                    <div className="flex items-center mb-2">
                                        <FaStar className="text-yellow-500 mr-1" />
                                        <span className="text-lg font-semibold mr-2">{review?.rating ?? "N/A"}</span>
                                    </div>
                                    <p>{review?.comment ?? "No comment provided"}</p>
                                    <p className="text-sm text-gray-600">- {review?.userId.name ?? "Anonymous"}</p>
                                </div>
                            ))}
                        </div>

                        {/* See All Reviews Button */}
                        {reviews.length > 3 && (
                            <button
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="mt-4 text-blue-500 hover:underline"
                            >
                                {showAllReviews ? "Show Less" : "See All Reviews"}
                            </button>
                        )}

                        {/* Show all reviews */}
                        {showAllReviews && (
                            <div className="space-y-4 mt-4">
                                {reviews.map((review, index) => (
                                    <div key={index} className="border rounded p-3 bg-gray-100">
                                        <div className="flex items-center mb-2">
                                            <FaStar className="text-yellow-500 mr-1" />
                                            <span className="text-lg font-semibold mr-2">
                                                {review?.rating ?? "N/A"}
                                            </span>
                                        </div>
                                        <p>{review?.comment ?? "No comment provided"}</p>
                                        <p className="text-sm text-gray-600">- {review?.userId.name?? "Anonymous"}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        <hr className="my-4 border-gray-300" />

                        <h2 className="text-2xl font-semibold mt-4 mb-2">Contact Details</h2>
                        <p className="text-lg flex items-center mb-2">
                            <FaPhone className="mr-2 text-blue-500" /> {pgData.contact.phone}
                        </p>
                        <p className="text-lg flex items-center mb-4">
                            <FaEnvelope className="mr-2 text-blue-500" /> {pgData.contact.email}
                        </p>
                    </div>
                </div>
            ) : (
                <p>PG not found.</p>
            )}
        </div>
    );
}

export default ViewPG;
