import { Response } from "express";
import DescopeClient from "@descope/node-sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * Connects to Descope and returns a DescopeClient instance.
 * returns {DescopeClient | null} The DescopeClient instance if connected successfully, otherwise null.
 */
function connectDescope(res: Response) {
    try {
        return DescopeClient({
            projectId: process.env.PROJECT_ID!,
            managementKey: process.env.MGT_KEY!,
        });
    } catch (error) {
        console.error("Could not connect to Descope: ", error);
        res.status(500).json({ error: "Internal Server Error" });
        return null;
    }
}

export default connectDescope;
