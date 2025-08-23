import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { url } from "../utils/constant";

function SearchResult(){
    const {user,location}=useSelector(store=>store.auth);
    const locate = useLocation();
    const queryParams = new URLSearchParams(locate.search);
    const searchQuery = queryParams.get("query");
    const [pgs,setPGS]=useState([]);
    console.log(searchQuery);
    
    const fetchData=async ()=>{
      try{        
        const res=await axios.get(`${url}/user/search`,{
          params:{
            keyword:searchQuery
          }
        });
        console.log(res);
        
        if(res.data.success){
          console.log(res.data.data);      
          setPGS(res.data.pgs)
        }else{
          console.log("Error");
        }
      }catch(e){
        console.log(e);
      }
    }
    useEffect(()=>{
      if(searchQuery){
        fetchData()
      }
    },[searchQuery])
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-10 mt-6">
        <section className="mt-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3">
          Your Search Results.....
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
          {pgs.length > 0 ? (
            pgs.map((item) => (
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
                    <p className="text-lg">₹{item.rooms.rooms[2].price}/month</p>
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
          ) : (
            <p>No PGs listed yet. Try searching near university or nearby place</p>
          )}
        </div>
      </section>
        </div>
    )
}

export default SearchResult;