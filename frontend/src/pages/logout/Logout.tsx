import React, {useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDescope } from "@descope/react-sdk";



const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useDescope();

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-300 backdrop-blur-sm">
      <div className="bg-white rounded p-6 text-center w-64">
        <h2 className="mb-4">Logout</h2>
        <p className="mb-4">Are you sure you want to log out?</p>
        <button onClick={handleLogout} className="bg-button hover:opacity-75 text-white font-bold py-2 px-4 rounded mr-2">Yes</button>
        <button onClick={handleBack} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">No</button>
      </div>
    </div>
  );
};

export default Logout;