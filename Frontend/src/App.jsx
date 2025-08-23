import React, { useEffect, useState } from 'react'
import { Route,Routes } from "react-router-dom"
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from "axios"
import Login from './Pages/Login'
import Home from './Pages/Home'
import NavBar from './Components/Navbar'
import './index.css'
import { useSelector } from 'react-redux'
import Reset from './Pages/Reset'
import Add from './Pages/Add'
import AdminHome from './Pages/AdminHome'
import Dashboard from './Pages/Dashboard'
import PgDashboard from './Pages/PgDashboard'
import SearchResult from './Pages/SearchResult'
import Explore from './Pages/Explore'
import MyPG from './Pages/MyPG'
import ViewPG from './Pages/ViewPG'
import Profile from './Pages/Profile'
import BookingPage from './Pages/BookingPage'
import Payment from './Pages/Payment'
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { url } from './utils/constant'
import MyBookings from './Pages/MyBookings'
import Tenant from './Pages/Tenants'
import NotLoggedIn from './Components/NotLoggedIn'



function App() {
  const [showLogin,setShowLogin]=useState(false)
  const {token,user}=useSelector(state=>state.auth)
  const [stripeApiKey,setStripeApiKey]=useState("")
  const {profile}=useSelector(store=>store.profile)
  console.log(profile);
  
  let admin=false;
  if(user && user.userType=="pgOwner"){
    admin=true;
  }
  async function getStripeApiKey() {
    try {
      const { data } = await axios.get(`${url}/make/stripeKey`,{
        headers: {
            Authorization:`Bearer ${token}`,
        },
    });
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.error('Error fetching Stripe API key:', error);
    }
  }
  useEffect(()=>{
    getStripeApiKey()
  },[token]);  
  return (
    <div className="app">
      <ToastContainer/>
        <NavBar setShowLogin={setShowLogin}/>
        <Routes>
          <Route path="/" element={!admin?<Home/>:<AdminHome/>} />
          <Route path="/login" element={!token?<Login setShowLogin={setShowLogin} />:<Home/>} />
          <Route path="/reset-password/:token" element={<Reset />} />
          <Route path="/signup" element={!token?<Login setShowLogin={setShowLogin} />:<Home/>} />
          <Route path="/signup/verify" element={!token?<Login initialView="otpVerification" />:<Home/>} />
          <Route path="/search" element={<SearchResult/>}/>
          <Route path="/explore" element={token && !admin?<Explore/>:<NotLoggedIn/>}/>
          <Route path="/user/pg/:id" element={<ViewPG/>}/>
          <Route path="/user/pg/:id/booking" element={token && !admin?<BookingPage/>:<NotLoggedIn/>}/>
          <Route path="/user/payment/:id" element={ token && !admin && stripeApiKey?<Elements stripe={loadStripe(stripeApiKey)}><Payment /></Elements>:<NotLoggedIn/>}/>
          <Route path="/user/profile" element={token && !admin?<Profile/>:<NotLoggedIn/>}/>
          <Route path="/user/bookings" element={token && !admin?<MyBookings/>:<NotLoggedIn/>}/>
          <Route path="/myPG" element={token && !admin?<MyPG/>:<NotLoggedIn/>}/>
          <Route path="/admin/add" element={admin?<Add/>:<AdminHome/>}/>
          <Route path="/admin/dashboard" element={user && user.userType==="pgOwner"?<Dashboard/>:<AdminHome/>}/>
          <Route path="/admin/pg/:id" element={admin?<PgDashboard/>:<AdminHome/>}/>
          <Route path="/admin/pg/:id/tenants" element={admin?<Tenant/>:<AdminHome/>}/>
        </Routes>
    </div>
  )
}
export default App