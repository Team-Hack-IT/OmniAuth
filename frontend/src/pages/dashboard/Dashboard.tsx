import React from "react";

const Dashboard = () => {
  return (
   
      <div>
        <div className="bg-gray-300 p-5  rounded-md mb-5">
          <h1 className="text-xl md:text-3xl font-bold mt-10 mb-10">Dashboard</h1>
          <p className="mb-10 text-sm font-thin">
            Click the link below to generate a unique API key to integrate
          </p>
        </div>
        <div className="bg-gray-300 p-8  md:p-24 rounded-md mb-5 flex justify-center items-center ">
          <button className="bg-green-500 text-white  text-sm  px-4 py-2 rounded-md">
            Generate Unique ID
          </button>
       
      </div>
    </div>
  );
};

export default Dashboard;
