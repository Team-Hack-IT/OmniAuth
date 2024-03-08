import { Response, Request, NextFunction } from "express";
import BaseModelMiddleware from "./BaseModelMiddleware";

async function UserMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    if (await BaseModelMiddleware(req, res, "User")) {
        next();
    }
}

export default UserMiddleware;
