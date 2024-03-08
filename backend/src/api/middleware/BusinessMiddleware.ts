import { Response, Request, NextFunction } from "express";
import BaseModelMiddleware from "./BaseModelMiddleware";

async function UserMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    if (await BaseModelMiddleware(req, res, "Business")) {
        next();
    }
}

export default UserMiddleware;
