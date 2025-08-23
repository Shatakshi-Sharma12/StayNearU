import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../utils/constant";

const Reset = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(`${url}/auth/reset-password/${token}`, {
        token,
        password
      });
      if (res.data.success) {
        alert("Password reset successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-50 to-blue-100 py-12">
      <div className="relative z-10 max-w-lg w-full bg-white rounded-3xl shadow-xl p-8">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="w-full mb-4 p-2 border"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full mb-4 p-2 border"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
          Reset Password
        </button>
      </form>
      </div>
    </div>
  );
};

export default Reset;
