import { Request, Response, NextFunction } from "express";
import {} from "../../utils/error";
import logger from "../../config/logger";

export default async function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log(err.message);
    switch (err.name) {
        case "BadRequest":
            res.status(400).json({ error: err.message });
            break;
        case "Unauthorized":
            logger.warn(`Unauthorized request: ${req.path}, by ${req.ip}`);
            res.status(401).json({ error: err.message });
            break;
        case "Forbidden":
            logger.warn(`Forbidden request: ${req.path}, by ${req.subject}`);
            res.status(403).json({ error: err.message });
            break;
        case "NotFound":
            res.status(404).json({ error: err.message });
            break;
        default:
            logger.error(`${err.message}`);
            res.status(500).json({ error: "Internal Server Error" });
    }
}
