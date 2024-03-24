import { Response, Request, NextFunction } from "express";
import { loadData } from "../../utils/model";
import { Business } from "../../@types/model.types";
import { Forbidden } from "../../utils/error";

export default async function businessMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const data = (await loadData(req.subject, "business")) as Business;

        if (data.role !== "business") throw new Forbidden();

        req.user = data;
        next();
    } catch (error) {
        next(error);
    }
}
