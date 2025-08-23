import React from "react";
import { useNavigate } from "react-router-dom";

const NotLoggedIn = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Replace with your actual login route
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-teal-50">
      <div className="bg-white shadow-lg rounded-lg border border-transparent p-8 mx-4 sm:mx-auto sm:max-w-lg relative">
        <div
          className="absolute inset-0 rounded-lg border-2"
          style={{
            backgroundImage: "linear-gradient(to right, #bfdbfe, #5eead4)",
            zIndex: "-1",
          }}
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Oops! You are not logged in
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          To access this page, please log in to your account.
        </p>
        <div className="flex justify-center mb-6">
          {/* SVG Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-20 h-20 text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 14H5.236c-.824 0-1.236-1.007-.652-1.572l6.764-6.428a1.003 1.003 0 011.304 0l6.764 6.428c.584.565.172 1.572-.652 1.572H14v5H10v-5z"
            />
          </svg>
        </div>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-teal-400 text-white font-semibold rounded-lg shadow-lg hover:from-blue-500 hover:to-teal-500 transition-all"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default NotLoggedIn;
