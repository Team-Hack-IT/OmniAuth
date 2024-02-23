import { Response, NextFunction } from "express";
import RequestWithUser from "../../types/request";
import connectDescope from "../../config/descope.config";

export async function sessionMiddleware(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const descopeClient = connectDescope();

        if (!descopeClient) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        const authInfo = await descopeClient.validateSession(token);

        console.log(
            "Session successfully validated for %s at %s",
            req.ip,
            new Date(),
            authInfo
        );

        if (!authInfo || !authInfo.token.sub) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        req.token = token;
        req.subject = authInfo.token.sub;

        next();
    } catch (error) {
        console.error("Error validating session: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
