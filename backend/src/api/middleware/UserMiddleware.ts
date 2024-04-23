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
        const data = (await loadData(req.subject, "user")) as User;

        if (data.role !== "user") throw new Forbidden();

        if (data.document) data.document = JSON.parse(data.document.toString());
        req.user = data;
        next();
    } catch (error) {
        next(error);
    }
}
