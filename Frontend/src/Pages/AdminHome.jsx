import React, { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FaUser, FaBuilding, FaHandshake } from "react-icons/fa";
import axios from "axios";
import { url } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setList } from "../Redux/pgSliceAdmin";

function AdminHome() {
  const {user}=useSelector(store=>store.auth);
  const dispatch=useDispatch();
  const userId=user._id;
  const fetchData=async ()=>{
    const res=await axios.get(url+"/admin/getAllPG",{
      params:{userId}
    });
    console.log(res);
    if(res.data.success){
      dispatch(setList(res.data.pg));  
      console.log(res.data.pg);
          
    }else{
      console.log("Error");
      
    }
  }

  useEffect(()=>{
    fetchData();
  },[])
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-teal-50 pt-20">
      <section className="relative flex flex-col items-center justify-center min-h-screen py-20 text-center">
        <div className="absolute inset-0 z-0 opacity-50">
          <FaBuilding className="absolute w-32 h-32 text-blue-400 animate-float" style={{ top: '10%', left: '10%' }} />
          <FaHandshake className="absolute w-32 h-32 text-blue-600 animate-float" style={{ top: '20%', right: '20%' }} />
          <FaUser className="absolute w-32 h-32 text-blue-400 animate-float" style={{ bottom: '10%', left: '10%' }} />
          <FaBuilding className="absolute w-32 h-32 text-blue-400 animate-float" style={{ bottom: '5%', right: '10%' }} />
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <h1 className="text-5xl font-extrabold leading-snug">
            List Your PG <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">Easily and Profitably</span>
            <br /> with <span className="tracking-wide font-normal text-blue-500 text-6xl">StayNearU</span>
          </h1>
          <p className="text-lg font-light tracking-wide italic">
            Join hundreds of PG owners and make your accommodations available to students. Hassle-free, secure, and rewarding.
          </p>
        </div>

        <div className="relative z-10 w-full max-w-lg mt-8">
          <div className="relative flex items-center w-full p-3">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 text-lg bg-transparent border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none text-gray-700"
              placeholder="Search properties listed by location..."
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <button className="text-white bg-blue-500 px-3 py-1 rounded-full font-normal hover:bg-blue-700 transition-all duration-300 transform">
              Join as a PG Owner
            </button>
            <button className="text-white bg-blue-500 px-3 py-1 rounded-full font-normal hover:bg-blue-700 transition-all duration-300 transform">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <hr className="border-t-2 border-gray-500 mx-auto my-10 w-1/2" />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Choose StayNearU for Your PG?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
            <div className="relative bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
              <h3 className="text-2xl font-semibold mb-3">Increased Visibility</h3>
              <p className="text-gray-600">
                Showcase your PG to thousands of students actively looking for PG accommodations near their universities.
              </p>
              <button className="mt-4 bg-blue-500 px-4 py-2 rounded-full font-semibold text-white hover:bg-blue-700 transition">
                Get Started
              </button>
            </div>

            <div className="relative bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
              <h3 className="text-2xl font-semibold mb-3">Secure and Easy Management</h3>
              <p className="text-gray-600">
                Manage your PG details, pricing, and availability through our user-friendly platform.
              </p>
              <button className="mt-4 bg-blue-500 px-4 py-2 rounded-full font-semibold text-white hover:bg-blue-700 transition">
                Learn More
              </button>
            </div>

            <div className="relative bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
              <h3 className="text-2xl font-semibold mb-3">Connect with Students</h3>
              <p className="text-gray-600">
                Build trust with students through verified listings and prompt communication.
              </p>
              <button className="mt-4 bg-blue-500 px-4 py-2 rounded-full font-semibold text-white hover:bg-blue-700 transition">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-t-2 border-gray-500 mx-auto my-10 w-1/2" />
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">What Our PG Owners Say</h2>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="flex flex-col items-center space-y-4">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="Suresh Mehta"
                className="w-24 h-24 rounded-full border-4 border-blue-500"
              />
              <p className="text-lg italic text-gray-600 max-w-sm">
                "Listing my PG on StayNearU was a game changer. The platform is seamless, and I have full control over my bookings."
              </p>
              <h4 className="font-semibold text-gray-800">Suresh Mehta, Delhi</h4>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt="Anita Roy"
                className="w-24 h-24 rounded-full border-4 border-blue-500"
              />
              <p className="text-lg italic text-gray-600 max-w-sm">
                "StayNearU has helped me reach more students, and I can manage everything from one place. Highly recommended!"
              </p>
              <h4 className="font-semibold text-gray-800">Anita Roy, Bangalore</h4>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Vijay Kumar"
                className="w-24 h-24 rounded-full border-4 border-blue-500"
              />
              <p className="text-lg italic text-gray-600 max-w-sm">
                "The verification process and support provided by StayNearU gave me peace of mind while listing my properties."
              </p>
              <h4 className="font-semibold text-gray-800">Vijay Kumar, Chennai</h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminHome;
