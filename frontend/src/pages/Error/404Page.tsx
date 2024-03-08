import { useNavigate } from "react-router-dom";
import React from "react";
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center sm:mx-2">
        <h1 className="text-4xl font-semibold text-button sm:text-md">
          404 - Not Found
        </h1>
        <p className="text-lg mt-4 text-txt">
          Oops! The page you are looking for could not be found.
        </p>
        <p className="text-lg mt-2 text-txt">
          It seems like you've ventured into uncharted territory.
        </p>
        </div>
        <div className="">
        <button
          onClick={() => navigate(-1)}
          className="mt-6 py-2 px-4 bg-button text-white  rounded hover:bg-button2 transition duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
