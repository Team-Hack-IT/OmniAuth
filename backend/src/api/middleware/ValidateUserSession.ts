import DescopeClient from "@descope/node-sdk";
import { Request, Response, NextFunction } from "express";

export async function sessionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const descopeClient = DescopeClient({
            projectId: process.env.PROJECT_ID || "None",
        });

        const { cookies } = req;
        const out = await descopeClient.validateAndRefreshSession(
            cookies[DescopeClient.SessionTokenCookieName],
            cookies[DescopeClient.RefreshTokenCookieName]
        );

        if (out?.cookies) {
            res.set("Set-Cookie", out.cookies);
        }

        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
}