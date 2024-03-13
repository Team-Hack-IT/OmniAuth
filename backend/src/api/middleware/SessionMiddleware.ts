import { Response, Request, NextFunction } from "express";
import connectDescope from "../../config/descope.config";

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

    const descopeClient = connectDescope(res);
    if (!descopeClient) {
        return;
    }
    
    const authInfo = await descopeClient.validateSession(token);

    console.log(
        "Session successfully validated for %s at %s",
        req.ip,
        new Date()
    );

    if (!authInfo || !authInfo.token.sub) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    req.token = token;
    req.subject = authInfo.token.sub;

    next();
}
