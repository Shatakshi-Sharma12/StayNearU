import React, { useState, useEffect } from "react";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import axios from "axios";
import { url } from "../utils/constant";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setProfileData } from "../Redux/profileSlice";

function Login() {
  const [view, setView] = useState("login");
  const [otpTimer, setOtpTimer] = useState(60);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isStudent, setIsStudent] = useState(true);
  const [isPGOwner, setIsPGOwner] = useState(false);
  const [otp, setOtp] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", otp: "", name: "" });
  const [canResendOtp, setCanResendOtp] = useState(false); // State for enabling resend OTP
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    const maskedLocalPart = localPart.slice(0, 2) + "***";
    return `${maskedLocalPart}@${domain}`;
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === "otpVerification") {
      setOtpTimer(60);
      setCanResendOtp(false); // Disable resend OTP initially
      const timerInterval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev === 1) {
            clearInterval(timerInterval);
            setCanResendOtp(true); // Enable resend OTP when timer ends
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = { email: "", password: "", otp: "", name: "" };

    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Email is not valid";

    if (view === "login" || view === "signup") {
      if (!password) newErrors.password = "Password is required";
    }

    if (view === "signup" && !name) {
      newErrors.name = "Name is required";
    }

    if (view === "otpVerification" && otp.length !== 6) {
      newErrors.otp = "Please enter a 6-digit OTP";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const fetchData=async(userId)=>{
    try{
      const res=await axios.get(`${url}/profile/get`,{
        params:{userId}
      });
      console.log(res);
      if(res.data.success){
        dispatch(setProfileData({
          name: res.data.profile.name,
          email:res.data.profile.email,
          phone:res.data.profile.phone,
          age: res.data.profile.age,
          gender: res.data.profile.gender,
          parent: res.data.profile.parent,
          address: res.data.profile.address,
          photo:res.data.profile.photo,
          aadharCard:res.data.profile.aadharCard,
          user:res.data.profile.user
        }))
      }
      
    }catch(e){
      console.log(e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let newUrl = url;
      let emailType = "";
      if (validateForm()) {
        if (view === "login") {
          newUrl += "/auth/login";
          const updatedData={email,password};          
          const res=await axios.post(newUrl,updatedData);
          if (res.data.success) {
            const { user, token } = res.data;
            localStorage.setItem("token", token);
            dispatch(setUser({ user, token }));
            fetchData(user._id);
            toast.success(res.data.msg);
            console.log(res.data.msg);
            
            navigate("/");
          }else{
            toast.error(res.data.msg);
          }
        } else if (view === "signup") {
          newUrl += "/auth/signup";
          emailType = "signup";
          const userType = isStudent ? "student" : "pgOwner";
          const updatedData = { name, email, password,userType };
          const res = await axios.post(newUrl, updatedData);
          if (res.data.success) {
            toast.success(res.data.msg);
            setMaskedEmail(maskEmail(email));
            handleViewChange("otpVerification");
          }else{
            toast.error(res.data.msg);
          }
        } else if (view === "otpVerification") {
          newUrl += "/auth/verify-otp";    
          const userType = isStudent ? "student" : "pgOwner";      
          const updatedData = { name, email, password,userType, otp };
          const res = await axios.post(newUrl, updatedData);
          console.log(res);
          console.log("yaha hu");

          if (res.data.success) {
            const { user, token } = res.data;
            localStorage.setItem("token", token);
            dispatch(setUser({ user, token }));
            toast.success(res.data.msg);
            navigate("/");
          }else{
            toast.error(res.data.msg);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const newUrl = `${url}/auth/forgot`;
      console.log("kkk");
      const updatedData = { email };
      const res = await axios.post(newUrl, updatedData);
      console.log(res);
      
      if (res.data.success) {
        alert("Reset link sent to your email");
        handleViewChange("login");
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };

  const handleResendOtp = async () => {
    try {
      const newUrl = `${url}/auth//verify-otp/resend`;
      const updatedData = { email };
      const res = await axios.post(newUrl, updatedData);
      if (res.data.success) {
        setMaskedEmail(maskEmail(email));
        setOtpTimer(60);
        setCanResendOtp(false);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  return (
    <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-teal-50 to-blue-100 py-12">
      <div className="relative z-10 max-w-lg w-full bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-4">
          {view === "login" ? "Login to StayNearU" : view === "signup" ? "Create Your Account":view==="forgotPassword"?"Reset Your Password":"Verify Your Account"}
        </h2>
        {view === "otpVerification" && (
          <p className="text-center text-gray-600 mb-4">
            We have sent a verification code to {maskedEmail}. Please enter the 6-digit OTP below to verify your account.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          {view === "signup" && (
            <>
            <div className="relative mb-2">
              <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl transition-all duration-300" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-transparent border-2 rounded-full focus:outline-none text-gray-700 ${errors.name ? "border-red-500" : "border-gray-200"}`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            </>
          )}
          {view !== "otpVerification"&&view!=="forgotPassword" && (
            <>
              <div className="relative mb-2">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl transition-all duration-300" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-transparent border-2 rounded-full focus:outline-none text-gray-700 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="relative mb-2">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl transition-all duration-300" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-transparent border-2 rounded-full focus:outline-none text-gray-700 ${errors.password ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </>
          )}    
          {view === "signup" && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Your Role</h3>
              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={isStudent}
                    onChange={() => {
                      setIsStudent(true);
                      setIsPGOwner(false);
                    }}
                    className="hidden" // Hide the default radio button
                  />
                  <span className={`w-6 h-6 flex items-center justify-center border-2 rounded-full ${isStudent ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} mr-2`}>
                    {isStudent && <span className="w-3 h-3 bg-white rounded-full"></span>}
                  </span>
                  <span className="text-gray-700">Student</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    checked={isPGOwner}
                    onChange={() => {
                      setIsPGOwner(true);
                      setIsStudent(false);
                    }}
                    className="hidden" // Hide the default radio button
                  />
                  <span className={`w-6 h-6 flex items-center justify-center border-2 rounded-full ${isPGOwner ? 'border-blue-500 bg-blue-500' : 'border-gray-300'} mr-2`}>
                    {isPGOwner && <span className="w-3 h-3 bg-white rounded-full"></span>}
                  </span>
                  <span className="text-gray-700">PG Owner</span>
                </label>
              </div>
            </div>
          )}      
          {view === "otpVerification" && (
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full pl-4 pr-4 py-3 bg-transparent border-2 rounded-full focus:outline-none text-gray-700 ${errors.otp ? "border-red-500" : "border-gray-200"}`}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
              )}
            </div>
          )}
          {view!=="forgotPassword"?<button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-bold rounded-full hover:from-blue-600 hover:to-teal-600 transition duration-200"
          >
            {view === "otpVerification" ? "Verify OTP" : view === "signup" ? "Sign Up" :view==="forgotPassword"?"Send Mail": "Login"}
          </button>:<></>}
        </form>
        {view === "forgotPassword" && (
            <div className="flex flex-col items-center mt-4">
              <p className="text-center text-gray-600 mb-4">
                Enter your email address to receive a password reset link.
              </p>
              <form onSubmit={handleForgotPassword}>
                <div className="relative mb-2">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl transition-all duration-300" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 bg-transparent border-2 rounded-full focus:outline-none text-gray-700 ${errors.email ? "border-red-500" : "border-gray-200"}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-full hover:bg-teal-600 transition duration-200"
                >
                  Send Reset Link
                </button>
              </form>
            </div>
          )}
        {view === "otpVerification" && (
          <div className="flex justify-center mt-4">
            {canResendOtp ? (
              <button
                onClick={handleResendOtp}
                className="text-blue-500 hover:underline"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-600">
                Resend OTP in {otpTimer} seconds
              </span>
            )}
          </div>
        )}
        {view === "login" && (
          <p className="text-center text-gray-600 mt-4">
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => handleViewChange("forgotPassword")}
            >
              Forgot Password?
            </span>
          </p>
        )}
        {view!=="otpVerification" && (
          <div className="mt-8 text-center">
          {view === "login" ? (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link onClick={() => handleViewChange("signup")} to="/signup">Sign Up</Link>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link onClick={() => handleViewChange("login")} to="/login">Login</Link>
            </p>
          )}
        </div>
        )}
      </div>
    </section>
  );
}

export default Login;
