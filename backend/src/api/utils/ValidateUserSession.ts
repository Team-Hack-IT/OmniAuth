import DescopeClient from '@descope/node-sdk';

try {
    const descopeClient = DescopeClient({ projectId: 'P2bMT7le7rEj4uL9gVKZpK9Kd6Md' });
} catch (error) {
    console.log("failed to initialize: " + error)
}

// Fetch session token from HTTP Authorization Header
const sessionToken="xxxx"

try {
  const authInfo = await descopeSdk.validateSession(sessionToken);
  console.log("Successfully validated user session:");
  console.log(authInfo);
} catch (error) {
  console.log ("Could not validate user session " + error);
}