/**import DescopeClient from '@descope/node-sdk';

try {
    const descopeClient = DescopeClient({ projectId: process.env.PROJECT_ID || "None" });
} catch (error) {
    console.log("failed to initialize: " + error);
}

// Fetch session token from HTTP Authorization Header
const sessionToken = req.headers.authorization;

try {
    const authInfo = await descopeSdk.validateSession(sessionToken); // Use the descopeSdk module
    console.log("Successfully validated user session:");
    console.log(authInfo);
} catch (error) {
  console.log ("Could not validate user session " + error);
}
**/