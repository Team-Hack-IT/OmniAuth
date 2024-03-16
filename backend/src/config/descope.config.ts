import DescopeClient, { descopeErrors } from "@descope/node-sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * Connects to Descope and returns a DescopeClient instance.
 * returns {DescopeClient | null} The DescopeClient instance if connected successfully, otherwise throws an error.
 */
function connectDescope() {
    try {
        return DescopeClient({
            projectId: process.env.PROJECT_ID!,
            managementKey: process.env.MGT_KEY!,
        });
    } catch (error) {
        switch (error) {
            case descopeErrors.badRequest:
            case descopeErrors.invalidRequest:
            case descopeErrors.missingArguments:
                throw new Error("Internal Server Error");

            case descopeErrors.userNotFound:
                throw new Error("User Not Found");

            default:
                throw new Error("Internal Server Error");
        }
    }
}

export default connectDescope;
