import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { url } from "../utils/constant";

function Dashboard() {
  const { pgs } = useSelector((store) => store.pg);
  const {user}=useSelector(store=>store.auth)
  console.log(pgs);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white p-10">
      {/* Welcome section */}
      <section className="text-center py-10">
        <h1 className="text-5xl font-bold text-gray-800">
          Welcome, {user?(user.name):"PG Owner"}!
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Manage your PG listings, interact with tenants, and grow your business.
        </p>
      </section>

      {/* PG listings section */}
      <section className="mt-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3">
          Your Listed PGs
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
                      to={`/admin/pg/${item._id}`}
                      className="bg-transparent border-2 border-teal-400 px-4 py-2 rounded-full font-semibold hover:bg-teal-500 transition"
                    >
                      Manage PG
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No PGs listed yet. Start by adding your property.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;



// Overview Section
    {/* <section className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <FaHome className="text-6xl text-indigo-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Total PG Listings</h2>
        <p className="text-gray-600 mt-2">{pgs.length} Listings</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <FaMoneyBillWave className="text-6xl text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Monthly Earnings</h2>
        <p className="text-gray-600 mt-2">₹500,000</p>
      </div>
    </section> */}  


    {/* <section className="mt-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Manage PG Listings</h3>
          <p className="text-gray-600">
            Update or edit the details of your PG listings, manage availability, and more.
          </p>
          <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-700 transition">
            Edit Listings
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">View Tenant Details</h3>
          <p className="text-gray-600">
            Check tenant information, lease details, and contact options.
          </p>
          <button className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-700 transition">
            View Tenants
          </button>
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
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Recent Notifications</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <ul className="list-disc pl-6">
          <li className="text-gray-700 mb-2">Tenant John Doe has submitted a maintenance request.</li>
          <li className="text-gray-700 mb-2">PG listing "Green Villa" has received a 5-star review.</li>
          <li className="text-gray-700 mb-2">New inquiry for "Skyline PG" from user ID 78945.</li>
        </ul>
      </div>
    </section> */}