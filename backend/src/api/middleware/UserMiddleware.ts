import { Response, NextFunction } from "express";
import RequestWithUser from "../../types/request";
import { connectDB } from "../../config/db.config";
import User from "../model/User";

export async function UserMiddleware(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
): Promise<void> {
    connectDB()
        .then(async (store) => {
            if (req.subject) {
                const user = await store.openSession().load<User>(req.subject);
                if (user) {
                    req.user.profile = user;
                    next();
                } else {
                    res.status(404).json({ error: "User Not Found" });
                }
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        });
}
