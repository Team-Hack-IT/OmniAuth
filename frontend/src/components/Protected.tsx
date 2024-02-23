import React from 'react'
import { useSession, useUser } from "@descope/react-sdk";
import { Outlet, Navigate } from 'react-router-dom';


const Protected = () => {
    const { isAuthenticated, isSessionLoading } = useSession();
    const { user, isUserLoading } = useUser();
  return (
    <div>
       {
      !isUserLoading &&   isAuthenticated && user ? <Outlet /> : <Navigate to="/login" />
       }
    </div>
  )
}

export default Protected