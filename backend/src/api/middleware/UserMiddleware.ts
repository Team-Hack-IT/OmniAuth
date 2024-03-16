import { Response, Request, NextFunction } from "express";
import loadData from "../../utils/loadData";

async function userMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const data = await loadData(req.subject, "users");

        if ((data as { role: string }).role !== "user")
            throw new Error("Forbidden");

        req.user = data;
        next();
    } catch (error) {
        next(error);
    }
}

export default userMiddleware;
