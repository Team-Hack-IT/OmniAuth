import React from 'react'
import { useNavigate } from 'react-router-dom'
import { RiAiGenerate } from "react-icons/ri";

const GenerateKey = () => {
const navigate = useNavigate();

    const handleKeyGen = () => {
        navigate("/onboarding")
    }

  return (
    <div>
    <div className="bg-gray-300 p-5  rounded-md mb-5">
      <h1 className="text-xl md:text-3xl font-bold mt-10 mb-10">Dashboard</h1>
      <p className="mb-10 text-sm font-thin">
        Click the link below to generate a unique API key to integrate
      </p>
    </div>
    <div className="bg-gray-300 p-8  md:p-24 rounded-md mb-5 flex  justify-center items-center ">
       
        
       
    <div className='flex justify-center items-center bg-button p-2 rounded-md cursor-pointer' onClick={handleKeyGen}>
    <button className="bg-button text-white  text-sm  px-4 py-2 rounded-md" >
        Generate Unique ID
      </button>
   
    <RiAiGenerate  className='text-white'/>
    
    </div>
    
   

   
  </div>
</div>
  )
}

export default GenerateKey