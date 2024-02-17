import DescopeClient from "@descope/node-sdk";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import User from "../model/User";
import { connectDB } from "../../config/db.config";

dotenv.config();

export async function sessionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const descopeClient = DescopeClient({
            projectId: process.env.PROJECT_ID || "None",
        });
        const authInfo = await descopeClient.validateSession(token);
        await connectDB()
            .then((store) => {
                const data = store
                    ?.openSession()
                    .query({ collection: "Users" })
                    .whereEquals("sub", authInfo.token.sub)
                    .firstOrNull();
            })
            .catch((error) => {
                res.status(500).json({ error: "Internal Server Error" });
                return;
            });

        console.log(
            "Session successfully validated for %s at %s",
            req.ip,
            new Date(),
            authInfo
        );
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Unauthorized " });
    }
}
