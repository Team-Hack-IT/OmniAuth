import { Request, Response } from "express";
import supabase from "../../config/db.config";
// import { getUser, saveUser } from "../../utils/redis";

async function BaseModelMiddleware(
    req: Request,
    res: Response
): Promise<object | null> {
    const sub = req.subject;
    // // const user = await getUser(sub);

    // if (user) {
    //     return user;
    // }

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("subject", sub);

    if (error) {
        res.status(500).json({ error: "Internal Server Error" });
        return null;
    }

    if (data.length === 0) {
        res.status(404).json({ error: "User Not Found" });
        return null;
    }

    const { password, subject, ...rest } = data[0];
    //await saveUser(sub, rest);

    return rest;
}

export default BaseModelMiddleware;
