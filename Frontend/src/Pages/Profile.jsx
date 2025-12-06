import React, { useState, useEffect } from "react";
import { FaUser, FaBook, FaMapMarkedAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { url } from "../utils/constant";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfileData } from "../Redux/profileSlice";


function Profile() {
  const [greeting, setGreeting] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    parent: "",
    address: ""
  });
  const dispatch = useDispatch();

  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const userId = user._id;
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${url}/profile/get`, {
        params: { userId },
      });
      if (res.data.success) {
        setProfile(res.data.profile);
        dispatch(setProfileData(res.data.profile));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Function to hit API
const saveProfileToServer = async () => {
  setLoading(true);

  try {
    const formData = new FormData();

    // Append only text fields
    const textFields = ["name", "email", "phone", "age", "gender", "parent", "address"];
    textFields.forEach((key) => {
      formData.append(key, profile[key]);
    });

    formData.append("user", userId);

    // Handle files only if selected
    if (profile.profilePhotoFile instanceof File) {
      formData.append("profilePhoto", profile.profilePhotoFile);
    }

    if (profile.aadharFileFile instanceof File) {
      formData.append("aadharFile", profile.aadharFileFile);
    }

    const res = await axios.post(`${url}/profile/create`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.success) {
      toast.success("Profile updated successfully");
       dispatch(setProfileData(res.data.profile));
      setShowPopup(false);
      navigate("/user/profile");
    }
  } catch (error) {
    console.error(error);
    toast.error("Failed to save profile.");
  } finally {
    setLoading(false);
  }
};

  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveProfileToServer();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-teal-50 mt-10 bg-gray-50 flex flex-col">

      {/* Greeting */}
      <div className="w-full h-auto md:h-40 bg-gradient-to-r from-blue-200 to-teal-50 flex items-center justify-center text-blue-800 p-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold">
            {greeting}, {user.name}!
          </h1>
          <p className="text-sm md:text-md mt-1">Welcome to your Profile Section.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-4">

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">

          <Link
            to="/myPG"
            className="bg-gradient-to-r from-blue-200 to-teal-50 p-4 md:p-6 rounded-lg shadow-lg text-center cursor-pointer border-2 border-blue-400"
          >
            <FaUser className="text-2xl md:text-4xl text-blue-500 mx-auto mb-2 md:mb-4" />
            <h3 className="text-md md:text-lg font-bold">My PG</h3>
            <p className="text-xs md:text-sm text-gray-700">View your PG Dashboard.</p>
          </Link>

          <Link
            to="/user/bookings"
            className="bg-gradient-to-r from-blue-200 to-teal-50 p-4 md:p-6 rounded-lg shadow-lg text-center cursor-pointer border-2 border-blue-400"
          >
            <FaBook className="text-2xl md:text-4xl text-blue-500 mx-auto mb-2 md:mb-4" />
            <h3 className="text-md md:text-lg font-bold">Bookings</h3>
            <p className="text-xs md:text-sm text-gray-700">View your booking history.</p>
          </Link>

          <Link
            to="/explore"
            className="bg-gradient-to-r from-blue-200 to-teal-50 p-4 md:p-6 rounded-lg shadow-lg text-center cursor-pointer border-2 border-blue-400"
          >
            <FaMapMarkedAlt className="text-2xl md:text-4xl text-blue-500 mx-auto mb-2 md:mb-4" />
            <h3 className="text-md md:text-lg font-bold">Explore</h3>
            <p className="text-xs md:text-sm text-gray-700">Explore PGs near your locations.</p>
          </Link>

        </div>

        {/* Profile Card */}
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg mt-4 md:mt-8">
          {profile ? (
            <div className="flex flex-col items-center justify-center bg-gray-100 py-6 md:py-10">
              <div className="bg-white shadow-lg rounded-lg border border-gray-200 w-full max-w-4xl p-4 md:p-10">

                {/* Header */}
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

                {/* Content */}
                {profile.name !== "" ? (
                  <div className="flex flex-col space-y-4">

                    {/* Fields */}
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
                        className="flex flex-col md:flex-row justify-between items-start md:items-center text-gray-700 text-sm border-b pb-2"
                      >
                        <p className="font-semibold md:w-1/3 mb-1 md:mb-0">{field.label}:</p>
                        <p className="w-full md:w-2/3 px-2 py-1 bg-gray-100 border border-gray-300 rounded">
                          {field.value}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm md:text-base text-gray-600">No profile details found.</p>

                    <button
                      className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg hover:from-blue-600 hover:to-teal-500"
                      onClick={() => setShowPopup(true)}
                    >
                      Add Profile Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Popup Form */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 p-4">

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-2xl border-4 border-blue-400 overflow-auto max-h-[90vh]">

            <h2 className="text-xl md:text-2xl font-bold mb-6 text-blue-800">Edit Profile</h2>

            <form className="space-y-4" onSubmit={handleSaveProfile}>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block font-semibold text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={profile.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block font-semibold text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Parent */}
              <div>
                <label className="block font-semibold text-gray-700">Parent</label>
                <input
                  type="text"
                  name="parent"
                  value={profile.parent}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block font-semibold text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>
              <div>
                <label className="block font-semibold text-gray-700">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setProfile({ ...profile, profilePhotoFile: e.target.files[0] })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700">Aadhar File</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) =>
                    setProfile({ ...profile, aadharFileFile: e.target.files[0] })
                  }
                  className="w-full"
                />
              </div>
              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-md ${loading ? "bg-gray-400" : "bg-blue-400 hover:bg-blue-500"}`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
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
