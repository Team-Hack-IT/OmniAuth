import DescopeClient from "@descope/node-sdk";
import dotenv from "dotenv";
import { ServerError } from "../utils/error";

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
        throw new ServerError();
    }
}

export default connectDescope;
