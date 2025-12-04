import React, { useState, useEffect } from "react";
import { FaUser, FaBook, FaMapMarkedAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { assets } from "../assets/assets";
import axios from "axios";
import { url } from "../utils/constant";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const [greeting, setGreeting] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email:"",
    phone:"",
    age: "",
    gender: "",
    parent: "",
    address: "",
    photo:"",
    aadharCard:""
  });
  const [showPopup, setShowPopup] = useState(false);
  const [photo,setPhoto]=useState(false)
  const [aadhar,setAadharFile]=useState(false)
  const {user,token}=useSelector(store=>store.auth);
  const userId=user._id;
  const navigate=useNavigate();
  const handleInputChange=(e)=>{
    setProfile({...profile,[e.target.name]:e.target.value});
    console.log(e.target.value);
    
  }
  const fetchData=async()=>{
    try{
      const res=await axios.get(`${url}/profile/get`,{
        params:{userId}
      });
      console.log(res.data.profile);
      if(res.data.success){
        setProfile(res.data.profile);
      }
      
    }catch(e){
      console.log(e);
    }
  }
  useEffect(() => {
    fetchData();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    console.log(photo);
    
    try {
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("aadhar", aadhar);
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("age", profile.age);
      formData.append("gender", profile.gender);
      formData.append("parent", profile.parent);
      formData.append("address", profile.address);
      formData.append("user", userId);
      
      const res = await axios.post(`${url}/profile/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (res.data.success) {
        toast.success(res.data.message);
        setAadharFile(false);
        setPhoto(false);
        setShowPopup(false)
        navigate("/user/profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile.");
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-teal-50 mt-10 bg-gray-50 flex flex-col">
      {/* Greeting Section */}
      <div className="w-full h-auto md:h-40 bg-gradient-to-r from-blue-200 to-teal-50 flex items-center justify-center text-blue-800 p-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold">{greeting}, {user.name}!</h1>
          <p className="text-sm md:text-md mt-1">Welcome to your Profile Section.</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 mt-4">
        {/* Cards Section - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Link to="/myPG" className="bg-gradient-to-r from-blue-200 to-teal-50 p-4 md:p-6 rounded-lg shadow-lg text-center cursor-pointer border-2 border-blue-400">
            <FaUser className="text-2xl md:text-4xl text-blue-500 mx-auto mb-2 md:mb-4" />
            <h3 className="text-md md:text-lg font-bold">My PG</h3>
            <p className="text-xs md:text-sm text-gray-700">View your PG Dashboard.</p>
          </Link>
          <Link to="/user/bookings" className="bg-gradient-to-r from-blue-200 to-teal-50 p-4 md:p-6 rounded-lg shadow-lg text-center cursor-pointer border-2 border-blue-400">
            <FaBook className="text-2xl md:text-4xl text-blue-500 mx-auto mb-2 md:mb-4" />
            <h3 className="text-md md:text-lg font-bold">Bookings</h3>
            <p className="text-xs md:text-sm text-gray-700">View your booking history.</p>
          </Link>
          <Link to="/explore" className="bg-gradient-to-r from-blue-200 to-teal-50 p-4 md:p-6 rounded-lg shadow-lg text-center cursor-pointer border-2 border-blue-400">
            <FaMapMarkedAlt className="text-2xl md:text-4xl text-blue-500 mx-auto mb-2 md:mb-4" />
            <h3 className="text-md md:text-lg font-bold">Explore</h3>
            <p className="text-xs md:text-sm text-gray-700">Explore PGs near your locations.</p>
          </Link>
        </div>

        {/* Profile Details Section */}
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg mt-4 md:mt-8">
          {profile ? (
            <div className="flex flex-col items-center justify-center bg-gray-100 py-6 md:py-10">
              <div className="bg-white shadow-lg rounded-lg border border-gray-200 w-full max-w-4xl p-4 md:p-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-6">
                  <div className="mb-4 md:mb-0 text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-semibold text-blue-800">Profile</h2>
                    <p className="text-xs md:text-sm text-gray-600">View and update your profile details</p>
                  </div>
                  <button
                    className="px-4 py-2 md:px-5 md:py-2 bg-blue-500 text-white text-xs md:text-sm rounded-lg hover:bg-blue-600"
                    onClick={() => setShowPopup(true)}
                  >
                    Edit Profile
                  </button>
                </div>
          
                {/* Profile Content */}
                {profile.name!="" ? (
                  <div className="flex flex-col md:flex-row">
                    {/* Profile Image */}
                    <div className="flex-shrink-0 flex justify-center md:block mb-4 md:mb-0">
                      <img
  src={profile.photo ? `${url}/profile/${profile.photo}` : assets.upload_photo}
  alt="Profile"
  className="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-blue-400 object-cover shadow-md"
/>

                    </div>
          
                    {/* Profile Fields */}
                    <div className="md:ml-8 flex flex-col justify-center space-y-2 md:space-y-4 w-full">
                      {[
                        { label: "Name", value: profile.name },
                        { label: "Email", value: profile.email },
                        { label: "Phone", value: profile.phone },
                        { label: "Age", value: profile.age },
                        { label: "Parent", value: profile.parent },
                        { label: "Address", value: profile.address },
                        { label: "Gender", value: profile.gender },
                      ].map((field, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row justify-between items-start md:items-center text-gray-700 text-xs md:text-sm border-b pb-2"
                        >
                          <p className="font-semibold md:w-1/3 mb-1 md:mb-0">{field.label}:</p>
                          <p className="w-full md:w-2/3 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs md:text-sm">
                            {field.value}
                          </p>
                        </div>
                      ))}
                      {/* Aadhar Field */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-gray-700 text-xs md:text-sm">
                        <p className="font-semibold md:w-1/3 mb-2 md:mb-0">Aadhar:</p>
                        <button
  className="w-full md:w-2/3 px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs md:text-sm"
  onClick={() => window.open(`${url}/aadhar/${profile.aadharCard}`, "_blank")}
>
  View Aadhar
</button>

                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm md:text-base text-gray-600">No profile details found.</p>
                    <button
                      className="mt-4 px-4 py-2 md:px-6 md:py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-xs md:text-sm rounded-lg hover:from-blue-600 hover:to-teal-500"
                      onClick={() => setShowPopup(true)}
                    >
                      Add Profile Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center bg-white shadow-lg p-4 md:p-6 rounded-lg border border-gray-200 max-w-md mx-auto">
              <div className="bg-blue-100 p-3 md:p-4 rounded-full mb-2 md:mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 md:h-10 md:w-10 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    className="stroke-gray-400"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 14a3 3 0 100-6 3 3 0 000 6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
              </div>

              <p className="mb-4 text-sm md:text-lg font-semibold text-gray-700 text-center">
                It looks like you haven't completed your profile yet.
              </p>

              <button
                className="px-4 py-2 md:px-8 md:py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-xs md:text-sm font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-teal-500 hover:shadow-lg transition-all duration-200"
                onClick={() => setShowPopup(true)}
              >
                Add Profile Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-2xl border-4 border-blue-400 overflow-auto max-h-[90vh]">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-blue-800">Edit Profile</h2>
            <form className="space-y-3 md:space-y-4" onSubmit={handleSaveProfile}>
              {/* Form inputs with responsive text and padding */}
              <div>
                <label className="block text-sm md:text-base font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-2 py-1 md:px-3 md:py-2 text-xs md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Parent</label>
                <input
                  type="text"
                  name="parent"
                  value={profile.parent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  hidden
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Aadhar Card</label>
                <input
                  type="file"
                  name="aadharCard"
                  accept=".pdf"
                  onChange={(e)=>setAadharFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-4">
                <button
                  type="button"
                  className="px-3 py-2 md:px-4 md:py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-xs md:text-base"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 md:px-4 md:py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 text-xs md:text-base"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;