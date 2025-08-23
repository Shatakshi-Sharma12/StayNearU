import React from "react";
import { FaInfoCircle, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

function PgBar({ currentStep }) {
  const steps = [
    { id: 0, name: 'Basic Details', icon: <FaInfoCircle /> },
    { id: 1, name: 'Location', icon: <FaMapMarkerAlt /> },
    { id: 2, name: 'Contact Details', icon: <FaPhone /> }
  ];

  return (
    <div className="flex items-center justify-center w-4/5 mx-auto mt-5">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center text-center">
            <div className={`w-12 h-12 flex justify-center items-center text-2xl text-blue-500 border-2 border-blue-500 rounded-full ${currentStep >= step.id ? 'bg-blue-500 text-white' : 'bg-transparent'}`}>
              {step.icon}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 ${currentStep > step.id ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default PgBar;
