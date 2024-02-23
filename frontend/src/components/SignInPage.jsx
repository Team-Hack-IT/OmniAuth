// import React from 'react';
// import "../styles/SignInPage.css";

// import { useCallback } from 'react'

// import { useDescope, useSession, useUser,SignUpOrInFlow } from '@descope/react-sdk'
// import { Descope } from '@descope/react-sdk'
// import { getSessionToken } from '@descope/react-sdk';

// function SignInPage() {
//     const { isAuthenticated, isSessionLoading } = useSession()

//     const { user, isUserLoading } = useUser()

//     const { logout } = useDescope()


//     const exampleFetchCall = async () => {
//         const sessionToken = getSessionToken();

//     // example fetch call with authentication header
//         fetch('your_application_server_url', {
//             headers: {
//                 Accept: 'application/json',
//                 Authorization: 'Bearer ' + sessionToken,
//             }
//         })
//     } 

//     const handleLogout = useCallback(() => {
//         logout()
//     }, [logout])

//     return (
//         <>
//             <h1>Welcome to Omni Auth</h1>
//             {!isAuthenticated &&
//                 (
//                     <Descope
//                         flowId="sign-up-or-in"
//                         onSuccess={(e) => console.log(e.detail.user)}
//                         onError={(e) => console.log('Could not log in!')}
//                     />
//                 )
//             }

//             {
//                 (isSessionLoading || isUserLoading) && <p>Loading...</p>
//             }

//             {!isUserLoading && isAuthenticated &&
//                 (
//                 <>
//                     <p>Hello {user.name}</p>
//                     <div>My Private Component</div>
//                     <button onClick={handleLogout}>Logout</button>
//                 </>
//                 )
//             }
//         </>
//     )   
// }

// export default SignInPage



// // function SignInPage() {
// //     return (
// //         <div>
// //             <h1>Sign In Page</h1>
// //         </div>
// //     );
// // }

// // export default SignInPage