import { Response, Request, NextFunction } from "express";
import connectDescope from "../../config/descope.config";
import logger from "../../config/logger";
import { Unauthorized } from "../../utils/error";

async function sessionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) throw new Unauthorized();

        const authInfo = await connectDescope()
            .validateSession(token)
            .catch(() => {
                throw new Unauthorized();
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

export default sessionMiddleware;
