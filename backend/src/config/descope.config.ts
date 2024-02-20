import DescopeClient from "@descope/node-sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * Connects to Descope and returns a DescopeClient instance.
 * @returns {DescopeClient | null} The DescopeClient instance if connected successfully, otherwise null.
 */
function connectDescope() {
    try {
        return DescopeClient({
            projectId: process.env.PROJECT_ID || "None",
            managementKey: process.env.MGT_KEY || "None",
        });
    } catch (error) {
        console.error("Could not connect to Descope: ", error);
        return null;
    }
}

export default connectDescope;
