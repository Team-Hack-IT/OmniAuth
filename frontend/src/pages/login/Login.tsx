
import React, { useCallback } from 'react'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDescope, useSession, useUser } from '@descope/react-sdk'
import { Descope } from '@descope/react-sdk'
import { getSessionToken } from '@descope/react-sdk';

const Login = () => {
  const { isAuthenticated, isSessionLoading } = useSession()

  const { user, isUserLoading } = useUser()

  const { logout } = useDescope()

  const exampleFetchCall = async () => {
    const sessionToken = getSessionToken();

    // example fetch call with authentication header
    fetch('your_application_server_url', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + sessionToken,
      }
    })
  }

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])
  return (
    <>
    
    {!isAuthenticated &&
        (
            <Descope
                flowId="sign-up-or-in"
                onSuccess={(e) => console.log(e.detail.user)}
                onError={(e) => console.log('Could not log in!')}
            />
        )
    }

    {
        (isSessionLoading || isUserLoading) && <AiOutlineLoading3Quarters className='animate-spin text-3xl absolute top-[50%] left-[50%]'/>
    }

    {!isUserLoading && isAuthenticated &&
        (
        <>
            <p >Hello {user.name}</p>
            <div>My Private Component</div>
            <button onClick={handleLogout}>Logout</button>
        </>
        )
        
    }
</>
  )
}

export default Login