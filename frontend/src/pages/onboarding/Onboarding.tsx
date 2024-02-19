import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { GoOrganization } from "react-icons/go";

const Onboarding = () => {
  const [selectedTab, setSelectedTab] = useState<"individual" | "organization">(
    "individual"
  );
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (selectedTab === "individual") {
      navigate("/individual-onboarding");
    } else if (selectedTab === "organization") {
      navigate("/organization-onboarding");
    } else {
      return null;
    }
  };

  return (
    <div>
      <div className="bg-gray-300 p-5 rounded-md mb-5">
      <h1 className="text-3xl font-bold  mt-10 mb-10">
       Let's get started.
      </h1>
      <p className=" mb-10 font-thin">
       Are you signing up as an individual or a business?
      </p>
      </div>
    
      <div className="flex justify-center mb-4 gap-10">
        <div className=" flex flex-col items-center justify-center  gap-5  shadow-md p-4 md:p-10 rounded-md">
          <FaUser color="green" />
          <button
            className={`px-4 py-2 mx-2 rounded-md ${
              selectedTab === "individual"
                ? "text-green-500 bg-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedTab("individual")}
          >
            Individual
          </button>
        </div>
        <div className=" flex flex-col items-center justify-center  gap-5 p-4 md:p-10 shadow-md  rounded-md">
          <GoOrganization color="green" />
          <button
            className={`px-4 py-2 mx-2 rounded-md ${
              selectedTab === "organization"
                ? "text-green-500 bg-white"
                : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedTab("organization")}
          >
            Organization
          </button>
        </div>
      </div>
      <button
        className=" box-border border hover:border-green-500 p-2 transition-all duration-300 rounded-md bg-green-500 hover:opacity-75"
        onClick={handleSubmit}
      >
        Continue
      </button>
    </div>
  );
};

export default Onboarding;
