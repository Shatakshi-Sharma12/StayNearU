import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHome,FaMoneyBillWave } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { url } from "../utils/constant";
function PgDashboard(){
    const { pgs, user } = useSelector((store) => store.pg)
    const {id}=useParams();
    const [pg,setPG]=useState(null);
    const [monthlyEarnings, setMonthlyEarnings] = useState(0);
    const fetchPG=async ()=>{
        const res=await axios.get(`${url}/admin/getAdminPG/${id}`);
        
        if(res.data.success){
            console.log(res.data);
            setPG(res.data.pg);
            const earnings = res.data.pg.rooms.rooms.reduce((total, item) => {
                return total + item.price * (item.count - item.available);
            }, 0);
            setMonthlyEarnings(earnings);
        }else{
        console.log("Error");
        }
    }    
    useEffect(()=>{
        fetchPG()
    },[])
    if (!pg || !pg.rooms) {
        return <div>Loading...</div>;
    }
    
    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-10">
            <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <FaHome className="text-6xl text-indigo-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold">Total PG Listings</h2>
                    <p className="text-gray-600 mt-2">{pgs.length} Listings</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <FaMoneyBillWave className="text-6xl text-green-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold">Monthly Earnings</h2>
                    <p className="text-gray-600 mt-2">₹{monthlyEarnings.toLocaleString()}</p>
                </div>
            </section>
            <section className="mt-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Room Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pg.rooms.rooms.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                            <div key={index} className="mb-4">
                                <h4 className="text-lg font-medium">{item.type}</h4>
                                <p className="text-gray-600">
                                    Total Rooms: {item.count}
                                </p>
                                <p className="text-gray-600">
                                    Filled Rooms: {item.count - item.available}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="mt-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">View Tenant Details</h3>
                    <p className="text-gray-600 mb-6">
                        Check tenant information, lease details, and contact options.
                    </p>
                    <Link to={`/admin/pg/${id}/tenants`} className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-700 transition">
                        View Tenants
                    </Link>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Respond to Inquiries</h3>
                    <p className="text-gray-600">
                        Reply to questions or booking requests from potential tenants.
                    </p>
                    <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-700 transition">
                        View Inquiries
                    </button>
                    </div>
                </div>
                </section>

                <section className="mt-16">
                <h2 className="text-3xl font-bold text-gray-0800 mb-8">Recent Notifications</h2>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <ul className="list-disc pl-6">
                    <li className="text-gray-700 mb-2">Tenant John Doe has submitted a maintenance request.</li>
                    <li className="text-gray-700 mb-2">PG listing "Green Villa" has received a 5-star review.</li>
                    <li className="text-gray-700 mb-2">New inquiry for "Skyline PG" from user ID 78945.</li>
                    </ul>
                </div>
            </section>
        </div>
    )
}

export default PgDashboard;