import { Response, Request, NextFunction } from "express";
import BaseModelMiddleware from "./BaseModelMiddleware";

async function UserMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const data = await BaseModelMiddleware(req, res);

    if (data) {
        if ((data as { role: string }).role === "user") {
            req.user = data;
            next();
        } else {
            res.status(403).json({ error: "Forbidden" });
        }
    }
}

export default UserMiddleware;
