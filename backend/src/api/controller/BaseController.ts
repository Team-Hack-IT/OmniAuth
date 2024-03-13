import { Request, Response } from "express";
import bcrypt from "bcrypt";
import connectDescope from "../../config/descope.config";
import * as querystring from "querystring";
import supabase from "../../config/db.config";

const profile = async (req: Request, res: Response) => {
    res.status(200).json(req.user);
};

const exists = async (req: Request, res: Response, table: string) => {
    const { error, data } = await supabase
        .from(table)
        .select("*")
        .eq("subject", req.subject);

    if (error) {
        console.error("Error creating user: ", error);
        res.status(500).json({ error: "Internal Server Error" });
        return false;
    }

    if (data.length > 0) {
        res.status(409).json({ error: "User already exists" });
        return false;
    }
};

const create = async (
    req: Request,
    res: Response,
    table: string,
    obj: object
): Promise<Boolean> => {
    if ((await exists(req, res, table)) === false) {
        return false;
    }

    const { error } = await supabase.from(table).insert([
        {
            subject: req.subject,
            ...obj,
        },
    ]);

    if (error) {
        console.error("Error creating user: ", error);
        res.status(500).json({ error: "Internal Server Error" });
        return false;
    }

    res.status(201).json({ message: "Created" });
    return true;
};

const update = async (
    req: Request,
    res: Response,
    table: string,
    validAttr: string[]
): Promise<Boolean> => {
    for (const key in req.body) {
        let index = validAttr.indexOf(key);
        if (index === -1) {
            res.status(400).json({ error: "Bad Request" });
            return false;
        }
    }

    const { error } = await supabase
        .from(table)
        .update(req.body)
        .eq("subject", req.subject);

    if (error) {
        res.status(500).json({ error: "Internal Server Error" });
        return false;
    }

    res.status(200).json({ message: "Updated" });
    return true;
};

const del = async (
    req: Request,
    res: Response,
    table: string
): Promise<Boolean> => {
    try {
        const email = querystring.escape(req.query.email as string);

        if (!email) {
            res.status(400).json({ error: "Bad Request" });
            return false;
        }

        const descopeClient = connectDescope(res);
        if (!descopeClient) {
            return false;
        }

        await descopeClient.management.user.delete(email);
        await descopeClient.logoutAll(req.token);

        const { error } = await supabase
            .from(table)
            .delete()
            .eq("subject", req.subject);

        if (error) {
            res.status(500).json({ error: "Internal Server Error" });
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error deleting user: ", error);
        res.status(500).json({ error: "Internal Server Error" });
        return false;
    }
};

const updateModelEmail = async (
    req: Request,
    res: Response,
    table: string
): Promise<Boolean> => {
    try {
        const { email } = req.body;
        if (!email || !req.token) {
            res.status(400).json({ error: "Bad Request" });
            return false;
        }

        const descopeClient = connectDescope(res);
        if (!descopeClient) {
            return false;
        }

        await descopeClient.management.user.updateEmail(req.token, email, true);

        const { error } = await supabase
            .from(table)
            .update({ email })
            .eq("subject", req.subject);

        if (error) {
            res.status(500).json({ error: "Internal Server Error" });
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error Updating User", error);
        res.status(500).json({ error: "Internal Server Error" });
        return false;
    }
};

const setPassword = async (
    req: Request,
    res: Response,
    table: string
): Promise<Boolean> => {
    const { email } = req.user;
    const { password } = req.body;
    if (!password || !email || Object.keys(req.body).length != 1) {
        res.status(400).json({ error: "Bad Request" });
        return false;
    }

    try {
        const descopeClient = connectDescope(res);
        if (!descopeClient) {
            return false;
        }

        await descopeClient.management.user.setPassword(email, password);

        const { error } = await supabase
            .from(table)
            .update({ password: await bcrypt.hash(password, 12) })
            .eq("subject", req.subject);

        if (error) {
            res.status(500).json({ error: "Internal Server Error" });
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error setting password: ", error);
        res.status(500).json({ error: "Internal Server Error" });
        return false;
    }
};

const validatePassword = async (
    req: Request,
    res: Response
): Promise<Boolean> => {
    const { data, error } = await supabase
        .from("users")
        .select("password")
        .eq("subject", req.subject);

    if (error) {
        console.error("Error getting user: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

    if (!data || !data[0].password || !req.body.password) {
        res.status(400).json({ error: "Bad Request" });
        return false;
    }

    if (await bcrypt.compare(req.body.password, data[0].password)) {
        res.status(200).json({ message: "Password validated" });
        return true;
    } else {
        res.status(401).json({ error: "Unauthorized" });
        return false;
    }
};

const logout = async (req: Request, res: Response) => {
    try {
        const descopeClient = connectDescope(res);

        if (!descopeClient) {
            return;
        }
        await descopeClient.logout(req.token);
        res.json({ message: "Logged out" });
    } catch (error) {
        console.error("Error logging out: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const logoutAll = async (req: Request, res: Response) => {
    try {
        const descopeClient = connectDescope(res);

        if (!descopeClient) {
            return;
        }
        await descopeClient.logoutAll(req.token);
        res.json({ message: "Logged out" });
    } catch (error) {
        console.error("Error logging out: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export {
    profile,
    create,
    update,
    del,
    updateModelEmail,
    setPassword,
    validatePassword,
    logout,
    logoutAll,
};
