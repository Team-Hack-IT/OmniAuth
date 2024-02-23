import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
import hand from "../../assets/hand.png";
import face from "../../assets/face.png";
import id from "../../assets/id.png";
import video from "../../assets/video.png";

const Verification = () => {
  const navigate = useNavigate(); 
  const [selectedCard, setSelectedCard] = useState(""); 

  const handleCardClick = (cardName) => {
    setSelectedCard(cardName);
  };

  const handleContinueClick = () => {

    switch (selectedCard) {
      case "Phone":
        navigate("/phone-verification"); 
        break;
      case "Face":
        navigate("/face-verification");
        break;
      case "Video":
        navigate("/video-verification");
        break;
      case "ID":
        navigate("/id-verification"); 
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div>
      <div className="bg-gray-300 p-5 rounded-md mb-5">
        <h1 className="text-xl md:text-3xl font-bold mt-10 mb-10">
          Verify one of these to generate a unique API key
        </h1>
        <p className="mb-10 text-sm font-thin">
          Kindly select any one that is convenient for you{" "}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mx-0 md:mx-40">
        <div
          className={`bg-white rounded overflow-hidden shadow-lg p-6 md:p-16 md:max-w-[350px] flex flex-col justify-center items-center cursor-pointer ${
            selectedCard === "Phone" && "border-green-500 border-2"
          }`}
          onClick={() => handleCardClick("Phone")}
        >
          <div className="font-bold text-xl mb-2">
            <img src={hand} width={100} height={100} alt="Phone Verification" />
          </div>
          <p className="text-gray-700 text-base">Phone Number Verification</p>
        </div>
        <div
          className={`bg-white rounded overflow-hidden shadow-lg p-6 md:p-16 max-w-[350px] flex flex-col justify-center items-center cursor-pointer ${
            selectedCard === "Face" && "border-green-500 border-2"
          }`}
          onClick={() => handleCardClick("Face")}
        >
          <div className="font-bold text-xl mb-2">
            <img src={face} width={100} height={100} alt="Face Verification" />
          </div>
          <p className="text-gray-700 text-base">Face Verification</p>
        </div>
        <div
          className={`bg-white rounded overflow-hidden shadow-lg p-6 md:p-16 max-w-[350px] flex flex-col justify-center items-center cursor-pointer ${
            selectedCard === "Video" && "border-green-500 border-2"
          }`}
          onClick={() => handleCardClick("Video")}
        >
          <div className="font-bold text-xl mb-2">
            <img src={video} width={100} height={100} alt="Video Verification" />
          </div>
          <p className="text-gray-700 text-base">Video Verification</p>
        </div>
        <div
          className={`bg-white rounded overflow-hidden shadow-lg p-6 md:p-16 max-w-[350px] flex flex-col justify-center items-center cursor-pointer ${
            selectedCard === "ID" && "border-green-500 border-2"
          }`}
          onClick={() => handleCardClick("ID")}
        >
          <div className="font-bold text-xl mb-2">
            <img src={id} width={100} height={100} alt="ID Verification" />
          </div>
          <p className="text-gray-700 text-base">ID Verification</p>
        </div>
      </div>
      <div>
        <button
          className="p-4 bg-button rounded-md px-8"
          onClick={handleContinueClick}
          disabled={!selectedCard} // Disable button if no card is selected
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Verification;
