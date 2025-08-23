import React, { useState, useEffect } from "react";
import { FiSearch, FiUser, FiMapPin, FiCheck, FiX, FiMenu } from "react-icons/fi";
import { assets } from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { url } from "../utils/constant";
import { clearAuth, setLocation } from "../Redux/authSlice";
import axios from "axios";
import { resetProfile } from "../Redux/profileSlice";
import { setPgs } from "../Redux/pgSliceAdmin";
import { setBookingData } from "../Redux/bookingSlice";

function NavBar({ setShowLogin }) {
  const { token, user, location } = useSelector(store => store.auth);  
  const { profile } = useSelector(store => store.profile);
  
  let admin = false;
  if (user && user.userType == "pgOwner") {
    admin = true;
  }
  const ans=!admin && token;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
        navigate(`/search?query=${searchQuery}`);
        setSearchQuery("");
        setIsSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    const newUrl = url + "/auth/logout";
    try {
      const res = await axios.post(newUrl);
      localStorage.removeItem("token");
      dispatch(clearAuth());
      dispatch(resetProfile());
      dispatch(setPgs());
      dispatch(setBookingData());
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  };

  const handleLocationIconClick = () => {
    setIsLocationOpen(!isLocationOpen);
  };

  const handleLocationSubmit = () => {
    if (locationInput) {
      dispatch(setLocation(locationInput));
      setIsLocationOpen(false);
      setLocationInput("");
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isSearchOpen, location]);

  const renderMobileLinks = () => (
    <div className={`z-50 fixed top-16 left-0 w-52 h-full bg-white shadow-lg transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col p-4 space-y-4">
        <Link to="/" onClick={toggleMobileMenu} className="hover:text-blue-600">Home</Link>
        
        {admin ? (
          <>
            <Link to="/admin/dashboard" onClick={toggleMobileMenu} className="hover:text-blue-600">Dashboard</Link>
            <Link to="/admin/add" onClick={toggleMobileMenu} className="hover:text-blue-600">Add PG</Link>
          </>
        ) : (
          <>
            <Link to="/explore" onClick={toggleMobileMenu} className="hover:text-blue-600">Explore</Link>
            <Link to="/myPG" onClick={toggleMobileMenu} className="hover:text-blue-600">My PG</Link>
            <Link to="/user/bookings" onClick={toggleMobileMenu} className="hover:text-blue-600">My Bookings</Link>            
            {/* Location input for mobile */}
            {!admin && token?
              <div className="flex items-center space-x-2">
                {location && <span className="text-gray-600">{location}</span>}
                <button
                  className="text-blue-600 p-2 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  onClick={handleLocationIconClick}
                >
                  <FiMapPin className="text-xl" />
                </button>
              </div>:<></>
            }

            {isLocationOpen && (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="border border-blue-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                  placeholder="Enter location..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                />
                <button
                  onClick={handleLocationSubmit}
                  className="p-2 text-blue-600"
                >
                  <FiCheck className="text-xl" />
                </button>
              </div>
            )}
          </>
        )}
        {!admin? (
          <>
            <Link to="/user/profile" onClick={toggleMobileMenu} className="hover:text-blue-600">Profile</Link>
          </>
        ) : (
          <></>
        )}
        {token? (
            <button 
              onClick={() => { handleLogout(); toggleMobileMenu(); }} 
              className="text-blue-600 border-2 border-blue-600 px-4 py-1 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              Logout
            </button>
        ) : (
          <Link 
            to="/login" 
            onClick={() => { setShowLogin(true); toggleMobileMenu(); }} 
            className="text-blue-600 border-2 border-blue-600 px-4 py-1 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative">
      <nav className="bg-gradient-to-r from-blue-200 to-white py-3 px-6 shadow-md fixed top-0 left-0 w-full z-30">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="text-2xl tracking-wide font-normal text-blue-600">
              <Link to="/">StayNearU</Link>
            </div>
            <ul className="hidden md:flex space-x-12 text-lg font-medium">
              <Link to="/" className="font-normal text-base hover:text-blue-600 cursor-pointer transition-colors duration-300">Home</Link>
              {admin ? (
                <>
                  <Link to="/admin/dashboard" className="font-normal text-base hover:text-blue-600 cursor-pointer transition-colors duration-300">Dashboard</Link>
                  <Link to="/admin/add" className="font-normal text-base hover:text-blue-600 cursor-pointer transition-colors duration-300">Add PG</Link>
                </>
              ) : (
                <>
                  <Link to="/explore" className="font-normal text-base hover:text-blue-600 cursor-pointer transition-colors duration-300">Explore</Link>
                  <Link to="/myPG" className="font-normal text-base hover:text-blue-600 cursor-pointer transition-colors duration-300">My PG</Link>
                  <Link to="/user/bookings" className="font-normal text-base hover:text-blue-600 cursor-pointer transition-colors duration-300">My Bookings</Link>
                </>
              )}
            </ul>
          </div>
          <div className="flex items-center space-x-6">
            {/* Search button */}
            <button
              className="text-blue-600 p-2 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              onClick={toggleSearch}
            >
              <FiSearch className="text-xl" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button 
              className="md:hidden text-blue-600 p-2 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
              onClick={toggleMobileMenu}
            >
              <FiMenu className="text-xl" />
            </button>

            {/* Full Screen Location Logic */}
            {ans && (
              <>
                {location && (
                  <span className="nav-link hidden md:block">{location}</span>
                )}
                <button
                  className="text-blue-600 p-2 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hidden md:block"
                  onClick={handleLocationIconClick}
                >
                  <FiMapPin className="text-xl" />
                </button>
                {isLocationOpen && (
                  <div className="relative hidden md:block">
                    <input
                      type="text"
                      className="transition-all duration-300 transform origin-left border border-blue-600 p-2 rounded-md ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                      placeholder="Enter location..."
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                    />
                    <button
                      onClick={handleLocationSubmit}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-blue-600"
                    >
                      <FiCheck className="text-xl" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* User Authentication and Profile */}
            {user && (
              <NavLink to="#" className="nav-link hidden md:block">Hello, {profile.name || user.name}</NavLink>
            )}
            {!token ? (
              <Link to="/login" onClick={() => { setShowLogin(true); }} className="hidden md:block text-blue-600 border-2 border-blue-600 px-4 py-1 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300">
                Login
              </Link>
            ) : (
              <Link onClick={handleLogout} className="hidden md:block text-blue-600 border-2 border-blue-600 px-4 py-1 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300">
                Logout
              </Link>
            )}

            <div className="relative group">
              {token && !admin ? (
                <img
                  src={`${url}/profile/${profile.photo}`}
                  alt="Profile"
                  className="md:block hidden w-10 h-10 rounded-full cursor-pointer"
                />
              ) : (
                <FiUser className="text-2xl text-blue-600" />
              )}
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg py-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                {!admin?<>
                <Link to="/user/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                <Link to="/user/bookings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Bookings</Link>
                </>:<>
                <Link to="/admin/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Dashboard</Link>
                <Link to="/admin/add" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Add PG</Link>
                </>}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {renderMobileLinks()}

      {/* Search Modal */}
      <div
        className={`absolute w-full md:w-1/3 fixed left-0 right-0 bg-white shadow-lg p-4 mt-24 mx-auto rounded-lg z-20 transition-all duration-300 transform ${
          isSearchOpen ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center">
          <input
            type="text"
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
          <button
            className="ml-4 text-blue-600 p-2 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
            onClick={handleSearch}
          >
            <FiSearch className="text-xl" />
          </button>
          <button
            className="ml-4 text-blue-600 p-2 rounded-full border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
            onClick={toggleSearch}
          >
            <FiX className="text-xl"/>
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-10"></div>
      )}
    </div>
  );
}

export default NavBar;