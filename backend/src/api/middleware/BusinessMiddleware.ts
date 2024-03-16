import { Response, Request, NextFunction } from "express";
import loadData from "../../utils/loadData";

async function businessMiddleware(
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

export default businessMiddleware;
