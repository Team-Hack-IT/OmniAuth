import { Response, Request, NextFunction } from "express";
import { loadData } from "../../utils/model";
import { Forbidden } from "../../utils/error";

async function userMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const data = await loadData(req.subject, "user");

        if ((data as { role: string }).role !== "user") throw new Forbidden();

        req.user = data;
        next();
    } catch (error) {
        next(error);
    }
}

export default userMiddleware;
