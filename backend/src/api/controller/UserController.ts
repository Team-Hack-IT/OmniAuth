import { Response } from "express";
import bcrypt from "bcrypt";
import { connectDB } from "../../config/db.config";
import RequestWithUser from "../../types/request";
import connectDescope from "../../config/descope.config";
import User from "../model/User";

const descopeClient = connectDescope();

const logout = async (req: RequestWithUser, res: Response) => {
    try {
        await descopeClient?.logout(req.token);
        res.json({ message: "Logged out" });
    } catch (error) {
        console.error("Error logging out: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const logoutAll = async (req: RequestWithUser, res: Response) => {
    try {
        await descopeClient?.logoutAll(req.token);
        res.json({ message: "Logged out" });
    } catch (error) {
        console.error("Error logging out: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const profile = async (req: RequestWithUser, res: Response) => {
    res.json(req.user);
};

const updatePassword = async (req: RequestWithUser, res: Response) => {
    try {
        await descopeClient?.management.user.setPassword(
            req.token,
            req.body.password
        );
        setPassword(req, res);
    } catch (error) {
        console.error("Error changing password: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const createUser = async (req: RequestWithUser, res: Response) => {
    connectDB()
        .then(async (store) => {
            const session = store.openSession();

            if (!req.subject) {
                res.status(500).json({ error: "Internal Server Error" });
                return;
            }

            const user: User = {
                userId: req.subject,
                email: req.body.email,
                role: req.body.role,
            };
            session.store(user);
            session.saveChanges();
            res.json({ message: "User created" });
        })
        .catch((error) => {
            console.error("Error creating user: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};
const deleteUser = async (req: RequestWithUser, res: Response) => {
    try {
        await descopeClient?.management.user.delete(req.token);
        connectDB()
            .then(async (store) => {
                const session = store.openSession();
                const user: User | null = await session.load(
                    req.user.data.userId
                );
                if (user) {
                    session.delete(user);
                    session.saveChanges();
                } else {
                    res.status(404).json({ error: "User not found" });
                }
            })
            .catch((error) => {
                console.error("Error loading user: ", error);
                res.status(500).json({ error: "Internal Server Error" });
            });

        res.json({ message: "User deleted" });
    } catch (error) {
        console.error("Error deleting user: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateEmail = async (req: RequestWithUser, res: Response) => {
    try {
        await descopeClient?.management.user.updateEmail(
            req.token,
            req.body.email,
            true
        );
        connectDB()
            .then(async (store) => {
                const user: User | null = await store
                    .openSession()
                    .load(req.subject);
                if (user) {
                    const session = store.openSession();
                    user.email = req.body.email;
                    session.store(user);
                    session.saveChanges();
                    res.status(200).json({ message: "Email updated" });
                } else {
                    res.status(404).json({ error: "User not found" });
                }
            })
            .catch((error) => {
                console.error("Error loading user: ", error);
                res.status(500).json({ error: "Internal Server Error" });
            });
        res.status(200).json({ message: "Email updated" });
    } catch (error) {
        console.error("Error Updating User", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const setPassword = async (req: RequestWithUser, res: Response) => {
    connectDB()
        .then(async (store) => {
            const user: User | null = await store
                .openSession()
                .load(req.user.data.userId);
            if (user) {
                await bcrypt
                    .hash(req.body.password, 12)
                    .then((hash) => {
                        const session = store.openSession();
                        user.password = hash;
                        session.store(user);
                        session.saveChanges();
                        res.json({ message: "Password changed" });
                    })
                    .catch((error) => {
                        console.error("Error hashing password: ", error);
                        res.status(500).json({
                            error: "Internal Server Error",
                        });
                    });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        })
        .catch((error) => {
            console.error("Error loading user: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

const updateUser = async (req: RequestWithUser, res: Response) => {
    connectDB().then(async (store) => {
        const user: User | null = await store.openSession().load(req.subject);
        if (user) {
            const session = store.openSession();
            user.email = req.body.email;
            user.role = req.body.role;
            session.store(user);
            session.saveChanges();
            res.json({ message: "User updated" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
};
export {
    logout,
    logoutAll,
    profile,
    updatePassword,
    createUser,
    deleteUser,
    updateEmail,
};
