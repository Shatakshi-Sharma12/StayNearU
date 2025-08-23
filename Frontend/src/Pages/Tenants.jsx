import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEnvelope, FaTimesCircle } from "react-icons/fa";
import { url } from "../utils/constant";
import { useParams } from "react-router-dom";

function Tenant() {
  const [tenants, setTenants] = useState([]);
  const {id}=useParams();
  console.log(id);

  const fetchTenants = async () => {
    try {
      const res = await axios.get(`${url}/booking/admin/${id}`);
      if (res.data.success) {
        const updatedTenants = res.data.booking.map((tenant) => {
          const createdDate = new Date(tenant.bookingDate); // Booking creation date
          const expiryDate = new Date(createdDate);
          expiryDate.setMonth(expiryDate.getMonth() + parseInt(tenant.month, 10)); // Adding months to calculate expiry
  
          const currentDate = new Date();
          const timeDiff = expiryDate - currentDate;
          const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  
          return {
            ...tenant,
            expiryDate,
            remainingDays: remainingDays > 0 ? remainingDays : 0,
            status: remainingDays > 0 ? "Active" : "Expired",
          };
        });
  
        setTenants(updatedTenants);
      } else {
        console.error("Failed to fetch tenants.");
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };
  
  

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleTerminate = (tenantId) => {
    console.log(`Terminate tenure for tenant ID: ${tenantId}`);
    // Implement API call to terminate tenure
  };

  const handleDelete = (tenantId) => {
    console.log(`Delete tenant ID: ${tenantId}`);
    // Implement API call to delete student
  };

  const handleSendMail = (tenantEmail) => {
    console.log(`Send mail to: ${tenantEmail}`);
    // Implement API call to send mail
  };

  return (
    <div className="min-h-screen mt-10 bg-gray-100 p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Tenant Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col"
          >
            <div className="flex items-center mb-4">
              <img
                src={`${url}/profile/${tenant.profile.photo}` || "/placeholder-profile.png"}
                alt={tenant.profile.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h2 className="text-xl font-semibold">{tenant.profile.name}</h2>
                <p className="text-gray-600">{tenant.profile.email}</p>
                <p className="text-gray-600">{tenant.profile.phone}</p>
              </div>
            </div>
            <div className="text-gray-700 mb-4">
              <p>
                <strong>Room Type:</strong> {tenant.roomId}
              </p>
              <p>
                <strong>Transaction ID:</strong> {tenant.transactionId}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {new Date(tenant.expiryDate).toLocaleDateString()}
                </p>
                <p>
                <strong>Time Left:</strong> {tenant.remainingDays} days
                </p>
                <p>
                <strong>Status:</strong>{" "}
                <span
                    className={`${
                    tenant.status === "Active" ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {tenant.status}
                </span>
                </p>
            </div>
            {/* <div className="flex flex-col mt-auto">
              <button
                onClick={() => handleTerminate(tenant.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-full mb-2 hover:bg-red-700 transition"
              >
                <FaTimesCircle className="inline mr-2" /> Terminate Tenure
              </button>
              <button
                onClick={() => handleDelete(tenant.id)}
                className="px-4 py-2 bg-gray-500 text-white rounded-full mb-2 hover:bg-gray-700 transition"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
              <button
                onClick={() => handleSendMail(tenant.profile.email)}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition"
              >
                <FaEnvelope className="inline mr-2" /> Send Mail
              </button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tenant;
