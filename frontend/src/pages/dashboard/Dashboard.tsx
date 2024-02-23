import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";



const Dashboard = () => {
  const [show, setShow] = useState(false);

const handleShow = () => {
  setShow(!show);
}

  return (
    <div>
      <div className="bg-gray-300 flex flex-col md:flex-row py-10 md:py-0 justify-evenly items-center p-4 rounded-md">
        <div>
        <h3 className="md:text-3xl text-md pb-5 md:pb-0">Your unique ID</h3>
        </div>
        <div className="flex justify-center items-center bg-white rounded-md p-2 border-2 border-button ">
        <input type={
          show ? "text" : "password"
        }  
       className="p-2 rounded-md outline-none" />
        <div onClick={handleShow}>
{
  show ? <FaEye  className="cursor-pointer" /> : <FaRegEyeSlash className="cursor-pointer"/>
}
        </div>
  
        </div>
        <button className="mt-5 md:my-4  bg-button p-3  rounded-md text-sm md:text-lg">Block/Unblock</button>
      
      </div>
    </div>
  );
};

export default Dashboard;
