import DescopeClient from "@descope/node-sdk";
import dotenv from "dotenv";
import { ServerError } from "../utils/error";

dotenv.config();

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
