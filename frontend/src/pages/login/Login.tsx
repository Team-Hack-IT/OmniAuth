import React, { useCallback } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { Descope } from "@descope/react-sdk";
import { getSessionToken } from "@descope/react-sdk";
import {Navigate, useNavigate, useLocation} from "react-router-dom";

const Login = () => {
  const { isAuthenticated, isSessionLoading } = useSession();
  const location = useLocation();
const navigate = useNavigate();
  const { user, isUserLoading } = useUser();



  const exampleFetchCall = async () => {
    const sessionToken = getSessionToken();

    // example fetch call with authentication header
    fetch("your_application_server_url", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionToken,
      },
    });
  };

 


  const handleLogin = () => {
    navigate("/generate-key");
  }

  return (
    <>
      {!isAuthenticated && (
        <div className="max-w-[350px] mx-auto">
          <Descope
            flowId="sign-up-or-in"
            onSuccess={handleLogin}
            onError={(e) => console.log("Could not log in!")}
          />
        </div>
      )}

      {(isSessionLoading || isUserLoading) && (
        <AiOutlineLoading3Quarters className="animate-spin text-3xl absolute top-[50%] left-[50%]" />
      )}

      {!isUserLoading && isAuthenticated && (
        <Navigate to="/generate-key" state={{from: location.pathname}}/>
      )}
    </>
  );
};

export default Login;
