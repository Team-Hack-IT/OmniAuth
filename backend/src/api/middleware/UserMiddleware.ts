import { Response, NextFunction } from "express";
import RequestWithUser from "../../types/request";
import { connectDB } from "../../config/db.config";
import User from "../model/User";

export async function UserMiddleware(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    connectDB().then(async (store) => {
        if (req.subject) {
            const session = store.openSession();
            const user: (User & { "@metadata": any }) | null =
                await session.load(req.subject);

            if (user) {
                const { "@metadata": metadata, id, ...updatedUser } = user;
                const updatedAt = metadata ? metadata["@last-modified"] : null;
                req.user = { id, ...updatedUser, updatedAt };
                next();
            } else {
                res.status(404).json({ error: "Not Found" });
            }
        }
    });
}
