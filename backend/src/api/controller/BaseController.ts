import { Request, Response } from "express";
import bcrypt from "bcrypt";
import connectDescope from "../../config/descope.config";
import connectDB from "../../config/db.config";
import Business from "../model/Business";
import User from "../model/User";

const descopeClient = connectDescope();

const profile = async (req: Request, res: Response) => {
    res.json(req.user);
};

const create = async <T extends object>(
    req: Request,
    res: Response,
    newUser: T
): Promise<Boolean> => {
    const sub = req.subject;

    if (!sub) {
        res.status(400).json({ error: "Bad Request" });
        return false;
    }
    return connectDB()
        .then(async (store) => {
            const session = store.openSession();
            const user = await session.load<T>(sub);

            if (user) {
                session.dispose();
                res.status(409).json({ error: "Conflict" });
                return false;
            }

            session.store(newUser, sub);
            session.saveChanges();
            session.dispose();
            res.status(201).json({ message: "Created" });
            return true;
        })
        .catch((error) => {
            console.error("Error creating user: ", error);
            res.status(500).json({ error: "Internal Server Error" });
            return false;
        });
};

const update = async <T extends object>(
    req: Request,
    res: Response,
    user: T,
    validAttr: string[]
): Promise<Boolean> => {
    const sub = req.subject;

    if (!sub) {
        res.status(400).json({ error: "Bad Request" });
        return false;
    }

    for (const key in req.body) {
        let index = validAttr.indexOf(key);
        if (index === -1) {
            res.status(400).json({ error: "Bad Request" });
            return false;
        } else {
            let attr = validAttr[index];
            (user as any)[attr] = key;
        }
    }

    return connectDB()
        .then(async (store) => {
            const session = store.openSession();
            session.store(user, sub);
            session.saveChanges();
            session.dispose();
            res.status(201).json({ message: "Updated" });
            return true;
        })
        .catch(() => {
            res.status(500).json({ error: "Internal Server Error" });
            return false;
        });
};

const del = async (
    req: Request,
    res: Response,
    user: User | Business
): Promise<Boolean> => {
    try {
        if (!req.body.email || !req.token || !user) {
            res.status(400).json({ error: "Bad Request" });
            return false;
        }

        await descopeClient?.management.user.delete(req.body.email);
        await descopeClient?.logoutAll(req.token);

        return connectDB()
            .then(async (store) => {
                const session = store.openSession();
                session.delete(user);
                session.saveChanges();
                session.dispose();
                res.status(200).json({ message: "Deleted" });
                return true;
            })
            .catch(() => {
                res.status(500).json({ error: "Internal Server Error" });
                return false;
            });
    } catch (error) {
        console.error("Error deleting user: ", error);
        res.status(500).json({ error: "Internal Server Error" });
        return false;
    }
};

const updateModelEmail = async (
    req: Request,
    res: Response,
    user: User | Business
): Promise<Boolean> => {
    try {
        const { email } = req.body;
        if (!email || !req.token) {
            res.status(400).json({ error: "Bad Request" });
            return false;
        }

        await descopeClient?.management.user.updateEmail(
            req.token,
            email,
            true
        );

        return connectDB()
            .then(async (store) => {
                const session = store.openSession();
                user.email = email;
                session.store(user);
                session.saveChanges();
                res.status(200).json({ message: "Email Updated" });
                return true;
            })
            .catch(() => {
                res.status(500).json({ error: "Internal Server Error" });
                return false;
            });
    } catch (error) {
        console.error("Error Updating User", error);
        res.status(500).json({ error: "Internal Server Error" });
        return false;
    }
};

const setPassword = async (
    req: Request,
    res: Response,
    user: User | Business
): Promise<Boolean> => {
    if (!req.body.password || req.body.length > 1) {
        res.status(400).json({ error: "Bad Request" });
        return false;
    }

    try {
        await descopeClient?.management.user.setPassword(
            user.email,
            req.body.password
        );
        return connectDB()
            .then(async (store) => {
                return await bcrypt
                    .hash(req.body.password, 12)
                    .then((hash) => {
                        const session = store.openSession();
                        user.password = hash;
                        session.store(user);
                        session.saveChanges();
                        session.dispose();
                        res.status(200).json({ message: "Password updated" });
                        return true;
                    })
                    .catch((error) => {
                        console.error("Error hashing password: ", error);
                        res.status(500).json({
                            error: "Internal Server Error",
                        });
                        return false;
                    });
            })
            .catch(() => {
                res.status(500).json({ error: "Internal Server Error" });
                return false;
            });
    } catch (error) {
        console.error("Error setting password: ", error);
        res.status(500).json({ error: "Internal Server Error" });
        return false;
    }
};

const validatePassword = async (
    req: Request,
    res: Response,
    user: User | Business
): Promise<Boolean> => {
    if (!req.body.password || !user || !user.password) {
        res.status(400).json({ error: "Bad Request" });
        return false;
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
        res.status(200).json({ message: "Password is correct" });
        return true;
    } else {
        res.status(401).json({ error: "Unauthorized" });
        return false;
    }
};

const logout = async (req: Request, res: Response) => {
    try {
        await descopeClient?.logout(req.token);
        res.json({ message: "Logged out" });
    } catch (error) {
        console.error("Error logging out: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const logoutAll = async (req: Request, res: Response) => {
    try {
        await descopeClient?.logoutAll(req.token);
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
