import { Request, Response } from "express";
import connectDB from "../../config/db.config";
import User from "../model/User";
import Business from "../model/Business";

async function BaseModelMiddleware(
    req: Request,
    res: Response,
    modelType: string
): Promise<Boolean> {
    const sub = req.subject;
    if (!sub) {
        res.status(400).json({ error: "Bad Request" });
        return false;
    }

    return connectDB()
        .then(async (store) => {
            const session = store.openSession();
            let user: (User | (Business & { "@metadata": any })) | null = null;

            if (modelType === "User") {
                user = await session.load<User>(sub);
            } else if (modelType === "Business") {
                user = await session.load<Business & { "@metadata": any }>(sub);
            }

            if (!user) {
                session.dispose();
                res.status(404).json({ error: "Not Found" });
                return false;
            }

            if (
                (modelType === "User" && user.role !== "user") ||
                (modelType === "Business" && user.role !== "business")
            ) {
                session.dispose();
                res.status(403).json({ error: "Forbidden" });
                return false;
            }

            const {
                "@metadata": metadata,
                id,
                ...updatedUser
            } = user as Business & { "@metadata": any };
            const updatedAt = metadata ? metadata["@last-modified"] : null;

            req.user = { id, ...updatedUser, updatedAt };
            session.dispose();
            return true;
        })
        .catch(() => {
            res.status(500).json({ error: "Internal Server Error" });
            return false;
        });
}

export default BaseModelMiddleware;
