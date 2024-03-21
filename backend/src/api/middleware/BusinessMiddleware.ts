import { Response, Request, NextFunction } from "express";
import { loadData } from "../../utils/model";

export default async function businessMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const data = await loadData(req.subject, "business");

        if ((data as { role: string }).role !== "business")
            throw new Error("Forbidden");

        req.user = data;
        next();
    } catch (error) {
        next(error);
    }
}
