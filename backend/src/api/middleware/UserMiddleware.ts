import { Response, Request, NextFunction } from "express";
import { loadData } from "../../utils/model";
import { Forbidden } from "../../utils/error";
import { User } from "../../@types/model.types";

export default async function userMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const data = await loadData(req.subject, "user");

        if ((data as { role: string }).role !== "user") throw new Forbidden();

        req.user = data as User;
        next();
    } catch (error) {
        next(error);
    }
}
