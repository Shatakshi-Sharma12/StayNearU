import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { url } from "../utils/constant";

function Explore(){
    const {user,location}=useSelector(store => store.auth);
    const searchQuery=location;
    const [pgs,setPGS]=useState([]);
    const fetchData=async()=>{
        try{
            const res=await axios.get(`${url}/user/search`,{
                params:{
                    keyword: searchQuery
                }
            });
            if(res.data.success){
                setPGS(res.data.pgs);
            }else{
                console.log("Error");
            }
        }catch(e){
            console.log(e);
        }
    };
    console.log(pgs);
    
    useEffect(()=>{
        if (searchQuery){
            fetchData();
        }
    },[searchQuery]);
    console.log(location);
    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-10 mt-6">
            {location=="" ?
            (
                <div className="fixed top-15 left-0 right-0 text-black text-center py-4 z-20">
                    <h1>Please add your location or city to see PGs nearby.</h1>
                </div>
            ):(
                <section className="mt-4">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-3">
                        {`PGs nearby ${location}`}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
                        {pgs.length>0?(
                            pgs.map((item)=>(
                                <div
                                    key={item._id}
                                    className="relative bg-cover bg-center rounded-lg shadow-lg overflow-hidden h-80"
                                    style={{
                                        backgroundImage:
                                            `url(${url}/pg/${item.photo})`,
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                                    <div className="relative p-6 h-full flex flex-col justify-between z-10 text-white">
                                        <div>
                                            <h3 className="text-2xl font-semibold">{item.name}</h3>
                                            <p className="text-lg">₹{item?.rooms?.rooms?.[0]?.price ?? "N/A"}/month</p>
                                            <p className="text-sm">
                                                {item.distance} from {item.university}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex justify-between items-center">
                                            <Link
                                                to={`/user/pg/${item._id}`}
                                                className="bg-transparent border-2 border-teal-400 px-4 py-2 rounded-full font-semibold hover:bg-teal-500 transition"
                                            >
                                                View PG
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ):(
                            <p>No PGs listed yet. Try searching near a university or a nearby place</p>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Explore;
