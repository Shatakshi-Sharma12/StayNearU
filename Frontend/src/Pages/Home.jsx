import React, { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaUser, FaBed, FaMapMarkedAlt } from "react-icons/fa";
import './style.css';
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "../Redux/profileSlice";
import axios from "axios";
import { url } from "../utils/constant";

function Home() {
  // const [profile, setProfile] = useState(null);
  // const fetchData=async()=>{
  //   try{
  //     const res=await axios.get(`${url}/profile/get`,{
  //       params:{userId}
  //     });
  //     console.log(res.data.profile);
  //     if(res.data.success){
  //       setProfile(res.data.profile);
  //     }
      
  //   }catch(e){
  //     console.log(e);
  //   }
  // }
  // useEffect(()=>{
  //   fetchData();
  // },[])
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-teal-50 pt-20">
      <section className="relative flex flex-col items-center justify-center min-h-screen py-20 text-center">
        <div className="absolute inset-0 z-0 opacity-50">
          <FaUser className="absolute md:w-32 md:h-32 w-20 h-16 text-blue-400 animate-float" style={{ top: '10%', left: '10%' }} />
          <FaBed className="absolute md:w-32 md:h-32 w-20 h-16 text-blue-400 animate-float" style={{ top: '20%', right: '20%' }} />
          <FaMapMarkedAlt className="absolute md:w-32 md:h-32 w-20 h-16 text-blue-400 animate-float" style={{ bottom: '20%', left: '20%' }} />
          <FaUser className="absolute md:w-32 md:h-32 w-20 h-16 text-blue-400 animate-float" style={{ bottom: '10%', right: '10%' }} />

        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <h1 className="md:text-5xl text-3xl font-extrabold leading-snug">
            Find Your Ideal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">Stay Near You</span>
            <br /> with <span className="tracking-wide font-normal text-blue-500 md:text-6xl text-4xl">StayNearU</span>
          </h1>
          <p className="text-lg font-light tracking-wide italic">
            Easy, affordable, and convenient PG accommodations for students. Secure your stay before starting your academic journey!
          </p>
        </div>

        <div className="relative z-10 w-full max-w-lg mt-8">
          <div className="relative flex items-center w-full p-3">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 text-lg bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none text-gray-700"
              placeholder="Search your city or university..."
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <button className="text-white bg-blue-500 px-3 py-1 rounded-full font-normal hover:bg-blue-700 transition-all duration-300 transform">
              Delhi University
            </button>
            <button className="text-white bg-blue-500 px-3 py-1 rounded-full font-normal hover:bg-blue-700 transition-all duration-300 transform">
              Bangalore
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            <p className="font-light italic">Can't find a PG? Start by searching your city or university.</p>
            <p className="text-gray-400">Example: "Chennai" or "IIT Mumbai"</p>
          </div>
        </div>
      </section>

      <hr className="border-t-2 border-gray-500 mx-auto my-10 w-1/2" />
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Top Listings in Your Area (Delhi)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
            <div className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden h-80" style={{ backgroundImage: "url('https://5.imimg.com/data5/GW/PC/DZ/SELLER-31660501/paying-guest-water-facility-service-500x500.jpg')" }}>
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative p-6 h-full flex flex-col justify-between z-10 text-white">
                <div>
                  <h3 className="text-2xl font-semibold">Top PG in Delhi</h3>
                  <p className="text-lg">₹8,000/month</p>
                  <p className="text-sm">1.5km from Delhi University</p>
                </div>
                <button className="bg-transparent border-2 border-teal-400 px-2 w-32 py-2 rounded-full font-semibold hover:bg-teal-500 transition">
                  View Details
                </button>
              </div>
            </div>

            <div className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden h-80" style={{ backgroundImage: "url('https://5.imimg.com/data5/GW/PC/DZ/SELLER-31660501/paying-guest-water-facility-service-500x500.jpg')" }}>
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative p-6 h-full flex flex-col justify-between z-10 text-white">
                <div>
                  <h3 className="text-2xl font-semibold">Affordable PG near North Campus</h3>
                  <p className="text-lg">₹7,500/month</p>
                  <p className="text-sm">2km from Delhi University</p>
                </div>
                <button className="bg-transparent border-2 border-teal-400 px-2 w-32 py-2 rounded-full font-semibold hover:bg-teal-500 transition">
                  View Details
                </button>
              </div>
            </div>

            <div className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden h-80" style={{ backgroundImage: "url('https://5.imimg.com/data5/GW/PC/DZ/SELLER-31660501/paying-guest-water-facility-service-500x500.jpg')" }}>
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="relative p-6 h-full flex flex-col justify-between z-10 text-white">
                <div>
                  <h3 className="text-2xl font-semibold">Premium PG in South Campus</h3>
                  <p className="text-lg">₹10,000/month</p>
                  <p className="text-sm">1km from Delhi University</p>
                </div>
                <button className="bg-transparent border-2 border-teal-400 px-2 w-32 py-2 rounded-full font-semibold hover:bg-teal-500 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className="border-t-2 border-gray-500 mx-auto my-10 w-1/2" />
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">What Students Say About Us</h2>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col items-center space-y-4">
              <img
                src="https://randomuser.me/api/portraits/women/45.jpg"
                alt="Aditi Singh"
                className="w-24 h-24 rounded-full border-4 border-blue-500"
              />
              <p className="text-lg italic text-gray-600 max-w-sm">
                "StayNearU helped me find the perfect PG near my university. The process was smooth and easy!"
              </p>
              <h4 className="font-semibold text-gray-800">Aditi Singh, Delhi University</h4>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Rohit Sharma"
                className="w-24 h-24 rounded-full border-4 border-blue-500"
              />
              <p className="text-lg italic text-gray-600 max-w-sm">
                "Great service and amazing options. I secured my accommodation within a few hours of searching."
              </p>
              <h4 className="font-semibold text-gray-800">Rohit Sharma, Bangalore</h4>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <img
                src="https://randomuser.me/api/portraits/women/68.jpg"
                alt="Priya Menon"
                className="w-24 h-24 rounded-full border-4 border-blue-500"
              />
              <p className="text-lg italic text-gray-600 max-w-sm">
                "Highly recommend StayNearU for students looking for affordable and safe accommodations."
              </p>
              <h4 className="font-semibold text-gray-800">Priya Menon, Chennai</h4>
            </div>
          </div>
        </div>
      </section>
      <hr className="border-t-2 border-gray-500 mx-auto my-10 w-1/2" />
      <section className="py-16 bg-gradient-to-r from-blue-100 to-teal-50 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Why Choose Us?</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="max-w-sm transition-transform transform hover:scale-105 animate-float">
              <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Verified Listings</h3>
                <p className="text-gray-600">
                  All our PG accommodations are verified for quality and safety, ensuring a smooth and trustworthy experience.
                </p>
                <div className="absolute inset-0 opacity-50 bg-[#BBDEFB] rounded-lg"></div>
              </div>
            </div>
            <div className="max-w-sm transition-transform transform hover:scale-105 animate-float">
              <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Affordable Prices</h3>
                <p className="text-gray-600">
                  We offer the best deals on PGs that are easy on your pocket, without compromising on quality or amenities.
                </p>
                <div className="absolute inset-0 opacity-30 bg-[#90CAF9] rounded-lg"></div>
              </div>
            </div>
            <div className="max-w-sm transition-transform transform hover:scale-105 animate-float">
              <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">Hassle-Free Booking</h3>
                <p className="text-gray-600">
                  Our booking process is simple and fast, ensuring you find and secure your accommodation in just a few clicks.
                </p>
                <div className="absolute inset-0 opacity-30 bg-[#64B5F6] rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-[#BBDEFB] opacity-25 transform rotate-12"></div>
        <div className="absolute inset-0 bg-[#E3F2FD] opacity-25 transform -rotate-12"></div>
      </section>
    </div>
  );
}

export default Home;
