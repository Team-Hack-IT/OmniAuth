import { Response, Request, NextFunction } from "express";
import connectDescope from "../../config/descope.config";
import logger from "../../config/logger";

export async function sessionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) throw new Error("Unauthorized");

        const authInfo = await connectDescope().validateSession(token);

        logger.info(
            "Session successfully validated for %s at %s",
            req.ip,
            new Date()
        );

        if (!authInfo || !authInfo.token.sub) throw new Error("Unauthorized");

        req.token = token;
        req.subject = authInfo.token.sub;
        next();
    } catch (error) {
        next(error);
    }
}
