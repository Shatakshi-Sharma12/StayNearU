import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { url } from '../utils/constant';
import { setBookingData } from '../Redux/bookingSlice';
import { useDispatch, useSelector } from 'react-redux'

const BookingPage = () => {
    const {user}=useSelector(store=>store.auth)
    const [pgData, setPgData] = useState(null);
    const [months, setMonths] = useState(1); 
    const [transactionId, setTransactionId] = useState('');
    const [selectedRoom, setSelectedRoom] = useState("");
    const [roomPrice, setRoomPrice] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch=useDispatch();
    const { id } = useParams();
    let roomTypeId="";
    const userId=user._id;
    const [profile,setProfile]=useState(null);
    useEffect(() => {
        const fetchProfile=async()=>{
            try{
                const response = await axios.get(`${url}/profile/get`,{
                    params:{userId}
                })                
                if(response.data.success){
                    setProfile(response.data.profile._id)
                }
            }catch(e){
                console.log(e);
                
            }
        }
        const fetchPgData = async () => {
            try {
                const response = await axios.get(`${url}/user/getPG/${id}`);
                setPgData(response.data.pg);
            } catch (error) {
                console.error('Error fetching PG data', error);
            }
        };
        fetchPgData();
        fetchProfile();
    }, [id]);
    // console.log(profile);
    console.log(selectedRoom);
    
    useEffect(() => {
        setTotalAmount(roomPrice * months);
    }, [roomPrice, months]);

    const handleRoomChange = (roomId) => {
        const selectedRoomData = pgData.rooms.rooms.find((room) => room._id === roomId);
        if (selectedRoomData) {
            roomTypeId=selectedRoom._id;
            setRoomPrice(selectedRoomData.price);
            setSelectedRoom(roomId);
        }
    };

    const handleBooking = async () => {
        if (!selectedRoom) {
            setError('Please select a room type.');
            return;
        }
        if (!months) {
            setError('Please select a contract period.');
            return;
        }
        try {
            dispatch(setBookingData({
                room:pgData.rooms._id,
                months:months,
                amount: totalAmount,
                profile:profile,
                pgId: id,
                roomId: selectedRoom,
                contractPeriod: months,
                userId:userId
            }))
            navigate(`/user/payment/${userId}`);
        } catch (error) {
            console.error('Error booking PG', error);
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-100 pt-20"> 
            <div className="absolute top-4 right-4 opacity-10">
                <p>StayNearU</p>
            </div>

            <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-8">
                <h1 className="text-4xl font-semibold text-gray-800 mb-4">{pgData ? pgData.name : 'Loading...'}</h1>

                {pgData ? (
                    <>
                        <p className="text-lg text-gray-700 mb-2">
                            {pgData.address.street}, {pgData.address.city}, {pgData.address.state}, {pgData.address.pincode}
                        </p>
                        <p className="text-lg text-gray-700 mb-4">University: {pgData.university}</p>
                        <p className="text-lg text-gray-700 mb-4">Distance from University: {pgData.distance}</p>

                        <div className="flex flex-col mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Facilities</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                {pgData.facilities.map((facility, index) => (
                                    <li key={index} className="text-lg text-gray-700">{facility}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="roomType" className="block text-lg font-semibold text-gray-800 mb-2">
                                Select Room Type:
                            </label>
                            <select
                                id="roomType"
                                value={selectedRoom}
                                onChange={(e) => handleRoomChange(e.target.value)}
                                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                            >
                                <option value="">Select Room</option>
                                {pgData.rooms.rooms && pgData.rooms.rooms.length > 0 ? (
                                    pgData.rooms.rooms
                                        .filter((room) => room.available > 0) // Filter rooms with available > 0
                                        .map((room, index) => (
                                            <option key={index} value={room._id}>
                                                {room.type} - {room.price} INR/month
                                            </option>
                                        ))
                                ) : (
                                    <option value="">No rooms available</option>
                                )}
                            </select>

                        </div>

                        <div className="mb-6">
                            <label htmlFor="months" className="block text-lg font-semibold text-gray-800 mb-2">
                                Select contract period:
                            </label>
                            <select
                                id="months"
                                value={months}
                                onChange={(e) => setMonths(Number(e.target.value))}
                                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                            >
                                <option value="">Select contract period</option>
                                {[1, 3, 6, 12].map((month) => (
                                    <option key={month} value={month}>
                                        {month} month{month > 1 ? 's' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {error && <p className="text-red-500 text-lg">{error}</p>}

                        <div className="space-y-4 border-t-2 pt-4">
                            <div className="flex justify-between text-lg">
                                <span>Room Selected: {selectedRoom ? pgData.rooms.rooms.find((room) => room._id === selectedRoom)?.type : 'None'}</span>
                                <span>{roomPrice > 0 ? `${roomPrice} INR/month` : ''}</span>
                            </div>
                            <div className="flex justify-between text-lg">
                                <span>Contract Period:</span>
                                <span>{months} month{months > 1 ? 's' : ''}</span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex justify-between text-xl font-semibold">
                                <span>Total Amount to be Paid:</span>
                                <span>{totalAmount} INR</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBooking}
                            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mt-6"
                        >
                            Pay Now
                        </button>
                    </>
                ) : (
                    <p className="text-xl text-gray-700">Loading PG details...</p>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
