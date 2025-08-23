import React, { useState } from "react";
import PgBar from "../Components/PgBar";
import { url } from "../utils/constant";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { assets } from "../assets/assets";

const Add = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const {user,token}=useSelector(state=>state.auth)
  const userId=user._id;
  const navigate=useNavigate();
  const [photo,setPhoto]=useState("")
  const [pgDetails, setPgDetails] = useState({
    name: "",
    university:"",
    distance:"",
    street: "",
    city: "",
    state: "",
    pincode: "",
    latitude:"",
    longitude:"",
    facilities:[],
    phone: "",
    email: "",
    photo:""
  });
  const [roomDetails,setRoomDetails]=useState({
    rooms:[
    { type: "Single", count: 0, available: 0, price: 0 },
    { type: "Double", count: 0, available: 0, price: 0 },
    { type: "Triple", count: 0, available: 0, price: 0 },
  ]})
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (currentStep === 0) {
      if (!pgDetails.name) newErrors.name = "PG Name is required";
      if (!pgDetails.university) newErrors.university = "University Name is required";
      if (!pgDetails.distance) newErrors.distance = "Distance is required";
      if (!pgDetails.street) newErrors.street = "Street is required";
      if (!pgDetails.city) newErrors.city = "City is required";
      if (!pgDetails.state) newErrors.state = "State is required";
      if (!pgDetails.pincode) newErrors.pincode = "Pincode is required";
      if (!pgDetails.latitude) newErrors.latitude = "Latitude is required";
      if (!pgDetails.longitude) newErrors.longitude = "Longitude is required";
      if (!pgDetails.facilities) newErrors.facilities = "Pincode is required";
    } else if (currentStep === 1) {
      roomDetails.rooms.forEach((room, index) => {
        if (!room.count) newErrors[`roomCount_${index}`] = "Room count is required";
        if (!room.available) newErrors[`roomAvailable_${index}`] = "Available rooms are required";
        if (!room.price) newErrors[`roomPrice_${index}`] = "Room price is required";
      });
    } else if (currentStep === 2) {
      if (!pgDetails.phone) newErrors.phone = "Phone number is required";
      if (!pgDetails.email) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(pgDetails.email)) {
        newErrors.email = "Email is not valid";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const name=e.target.name;
    const value=e.target.value;
    setPgDetails((prevDetails) => ({
      ...prevDetails,
      [name]: name === "facilities" ? value.split(",").map(facility => facility.trim()) : value,
    }));
  };

  const handleRoomChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRooms = [...roomDetails.rooms];
    updatedRooms[index][name] = value;
    setRoomDetails({
      ...roomDetails,
      rooms: updatedRooms,
    });
  };

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log(photo);
    
    try{
      if (validateForm()) {
        const rooms=roomDetails.rooms;
        console.log(photo);
        const formData=new FormData();
        // formData.append('photo',photo);
        formData.append('name',pgDetails.name);
        formData.append('university',pgDetails.university);
        formData.append('distance',pgDetails.distance);
        formData.append('street',pgDetails.street);
        formData.append('city',pgDetails.city);
        formData.append('state',pgDetails.state);
        formData.append('pincode',pgDetails.pincode);
        formData.append('latitude',pgDetails.latitude);
        formData.append('longitude',pgDetails.longitude);
        formData.append('facilities',pgDetails.facilities);
        formData.append('phone',pgDetails.phone);
        formData.append('email',pgDetails.email);
        formData.append('rooms', JSON.stringify(rooms));
        formData.append('photo',photo);
        formData.append('userId',userId);
        console.log(rooms);
        
        // const data={...pgDetails,rooms,userId,photo};
        // console.log(data);
        
        const res=await axios.post(`${url}/admin/addPg`,formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // const res=await axios.post(`${url}/admin/addPg`,data);
        // console.log(res);
        
        if(res.data.success){
          toast.success(res.data.msg);
          navigate('/');
        }
      }
    }catch(e){
      console.log(e);
      toast.error("An error occurred")
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-50 to-blue-100 py-16">
      <div className="absolute top-0 w-full py-16 bg-transparent">
        <PgBar currentStep={currentStep} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-8 max-w-4xl w-full bg-white bg-opacity-40 backdrop-blur-lg rounded-lg shadow-lg border border-white border-opacity-50 mt-20"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          {currentStep === 0 ? "Add PG Details" : currentStep === 1 ? "Room Details" : "Contact Details"}
        </h2>

        {currentStep === 0 && (
          <>
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">PG Name</label>
              <input
                type="text"
                name="name"
                value={pgDetails.name}
                onChange={handleInputChange}
                placeholder="Enter PG Name"
                className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
            </div>
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">Nearest University or College</label>
              <input
                type="text"
                name="university"
                value={pgDetails.university}
                onChange={handleInputChange}
                placeholder="Enter Nearest University or College"
                className={`w-full px-4 py-2 border ${errors.university ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.university}</span>}
            </div>
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">Distance from nearest University or College</label>
              <input
                type="text"
                name="distance"
                value={pgDetails.distance}
                onChange={handleInputChange}
                placeholder="Enter Distance from nearest University or College"
                className={`w-full px-4 py-2 border ${errors.distance ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.distance}</span>}
            </div>

            <h3 className="text-xl font-medium mb-4 text-blue-600">Address</h3>
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">Street</label>
              <input
                type="text"
                name="street"
                value={pgDetails.street}
                onChange={handleInputChange}
                placeholder="Enter Street"
                className={`w-full px-4 py-2 border ${errors.street ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.street && <span className="text-red-500 text-sm">{errors.street}</span>}
            </div>
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={pgDetails.city}
                onChange={handleInputChange}
                placeholder="Enter City"
                className={`w-full px-4 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.city && <span className="text-red-500 text-sm">{errors.city}</span>}
            </div>
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">State</label>
              <input
                type="text"
                name="state"
                value={pgDetails.state}
                onChange={handleInputChange}
                placeholder="Enter State"
                className={`w-full px-4 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.state && <span className="text-red-500 text-sm">{errors.state}</span>}
            </div>
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">Pincode</label>
              <input
                type="number"
                name="pincode"
                value={pgDetails.pincode}
                onChange={handleInputChange}
                placeholder="Enter Pincode"
                className={`w-full px-4 py-2 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.pincode && <span className="text-red-500 text-sm">{errors.pincode}</span>}
            </div>
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={pgDetails.latitude}
                onChange={handleInputChange}
                placeholder="Enter Latitude"
                className={`w-full px-4 py-2 border ${errors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.latitude && <span className="text-red-500 text-sm">{errors.latitude}</span>}
            </div>
            <div className="mb-4">
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={pgDetails.longitude}
                onChange={handleInputChange}
                placeholder="Enter Longitude"
                className={`w-full px-4 py-2 border ${errors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.longitude && <span className="text-red-500 text-sm">{errors.longitude}</span>}
            </div>
              <label className="block text-blue-600 mb-2">Facilities</label>
              <input
                type="string"
                name="facilities"
                value={pgDetails.facilities}
                onChange={handleInputChange}
                placeholder="Add Facilities (',' separated)"
                className={`w-full px-4 py-2 border ${errors.facilities ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.facilities && <span className="text-red-500 text-sm">{errors.facilities}</span>}
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            <h3 className="text-xl font-medium mb-4 text-blue-600">Room Details</h3>
            {roomDetails.rooms.map((room, index) => (
              <div key={index} className="mb-6">
                <h4 className="text-lg font-semibold mb-2 text-blue-600">{room.type} Room</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-blue-600 mb-2">Total Count</label>
                    <input
                      type="number"
                      name="count"
                      value={room.count}
                      onChange={(e) => handleRoomChange(index, e)}
                      placeholder={`Enter ${room.type} Room Count`}
                      className={`w-full px-4 py-2 border ${errors[`roomCount_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                      required
                    />
                    {errors[`roomCount_${index}`] && <span className="text-red-500 text-sm">{errors[`roomCount_${index}`]}</span>}
                  </div>

                  <div>
                    <label className="block text-blue-600 mb-2">Available Rooms</label>
                    <input
                      type="number"
                      name="available"
                      value={room.available}
                      onChange={(e) => handleRoomChange(index, e)}
                      placeholder={`Enter Available ${room.type} Rooms`}
                      className={`w-full px-4 py-2 border ${errors[`roomAvailable_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                      required
                    />
                    {errors[`roomAvailable_${index}`] && <span className="text-red-500 text-sm">{errors[`roomAvailable_${index}`]}</span>}
                  </div>

                  <div>
                    <label className="block text-blue-600 mb-2">Price per Room</label>
                    <input
                      type="number"
                      name="price"
                      value={room.price}
                      onChange={(e) => handleRoomChange(index, e)}
                      placeholder={`Enter ${room.type} Room Price`}
                      className={`w-full px-4 py-2 border ${errors[`roomPrice_${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                      required
                    />
                    {errors[`roomPrice_${index}`] && <span className="text-red-500 text-sm">{errors[`roomPrice_${index}`]}</span>}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {currentStep === 2 && (
          <>
            <h3 className="text-xl font-medium mb-4 text-blue-600">Contact Details</h3>
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">Phone Number</label>
              <input
                type="number"
                name="phone"
                value={pgDetails.phone}
                onChange={handleInputChange}
                placeholder="Enter Phone Number"
                className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
            </div>
            <div className="mb-4">
              <label className="block text-blue-600 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={pgDetails.email}
                onChange={handleInputChange}
                placeholder="Enter Email Address"
                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md bg-transparent text-blue-600 placeholder:text-gray-400 focus:outline-none focus:border-blue-500`}
                required
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>
            <div>
                <p>Upload Photo</p>
                <label htmlFor="img" className="block font-semibold text-gray-700">
                <img className="w-20 cursor-pointer" src={photo?URL.createObjectURL(photo):assets.upload_photo} />
                </label>
                <input
                  type="file"
                  name="photo"
                  id="img" 
                  accept="image/*"
                  onChange={(e)=>setPhoto(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  hidden
                  required
                />
                {errors.photo && <span className="text-red-500 text-sm">{errors.photo}</span>}
              </div>
          </>
        )}

        <div className="flex justify-between mt-6">
          {currentStep>0 &&(
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-1 text-blue-600 rounded-md shadow-sm transition-all duration-300 ${currentStep === 0 ? 'bg-gray-400 text-white' : 'bg-white border-2 border-blue-600 hover:bg-blue-600 hover:text-white'}`}
          >
            Previous
          </button>
          )}
          {currentStep < 2 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-1 text-blue-600 text-blue-600 border-2 border-blue-600 rounded-md shadow-sm hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-all duration-300"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Add;