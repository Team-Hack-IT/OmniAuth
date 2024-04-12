import connectDescope from "../../config/descope.config";
import logger from "../../config/logger";
import { Response, Request, NextFunction } from "express";
import { ServerError, Unauthorized } from "../../utils/error";

export default async function sessionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) throw new Unauthorized();

        const authInfo = await connectDescope()
            .validateSession(token)
            .catch((error) => {
                if (error.message.includes("JWTExpired"))
                    throw new Unauthorized();
                throw new ServerError();
            });

        if (!authInfo || !authInfo.token.sub) throw new Unauthorized();

        req.token = token;
        req.subject = authInfo.token.sub;
        logger.info(`Session successfully validated for ${req.subject}`);
        next();
    } catch (error) {
        next(error);
    }
}
