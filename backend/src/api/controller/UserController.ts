import { Response } from "express";
import bcrypt from "bcrypt";
import { connectDB } from "../../config/db.config";
import RequestWithUser from "../../types/request";
import connectDescope from "../../config/descope.config";
import User from "../model/User";

const descopeClient = connectDescope();

const profile = async (req: RequestWithUser, res: Response) => {
    res.json(req.user);
};

const createUser = async (req: RequestWithUser, res: Response) => {
    connectDB()
        .then(async (store) => {
            const session = store.openSession();
            const user: User | null = await session.load(req.subject);

            if (user) {
                res.status(409).json({ error: "User already exists" });
                return;
            }

            const { firstname, lastname, email, role, country } = req.body;

            if (!firstname || !lastname || !email || !role || !country) {
                res.status(400).json({ error: "Bad Request" });
                return;
            }

            const newUser: User = {
                firstname,
                lastname,
                email,
                role,
                country,
                createdAt: new Date(),
            };
            session.store(newUser, req.subject);
            session.saveChanges();
            res.status(201).json({ message: "User created" });
        })
        .catch((error) => {
            console.error("Error creating user: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

const updateUser = async (req: RequestWithUser, res: Response) => {
    connectDB()
        .then(async (store) => {
            const user: User | null = await store
                .openSession()
                .load(req.subject);
            const validKeys = [
                "firstname",
                "lastname",
                "email",
                "role",
                "country",
            ];

            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            for (const key in req.body) {
                let index = validKeys.indexOf(key);
                if (index === -1) {
                    res.status(400).json({ error: "Bad Request" });
                    return;
                } else {
                    let attr = validKeys[index];
                    (user as any)[attr] = req.body[attr];
                }
            }

            const session = store.openSession();
            session.store(user, req.subject);
            session.saveChanges();
            res.status(200).json({ message: "User updated" });
        })
        .catch((error) => {
            console.error("Error updating user: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

const deleteUser = async (req: RequestWithUser, res: Response) => {
    try {
        if (!req.user?.email) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        await descopeClient?.management.user.delete(req.user.email);
        await descopeClient?.logoutAll(req.token);

        connectDB()
            .then(async (store) => {
                const session = store.openSession();
                const user: User | null = await session.load(req.subject);
                if (user) {
                    session.delete(user);
                    session.saveChanges();
                    res.json({ message: "User deleted" });
                } else {
                    res.status(404).json({ error: "User not found" });
                }
            })
            .catch((error) => {
                console.error("Error loading user: ", error);
                res.status(500).json({ error: "Internal Server Error" });
            });
    } catch (error) {
        console.error("Error deleting user: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateEmail = async (req: RequestWithUser, res: Response) => {
    try {
        if (!req.body.email || req.body.length > 1) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

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

const verifyPhone = async (req: RequestWithUser, res: Response) => {
    try {
        if (!req.body.phone || req.body.length > 1) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }
        if (!req.user?.email) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        await descopeClient?.otp.verify.sms(req.user.email, req.body.phone);
        connectDB()
            .then(async (store) => {
                const session = store.openSession();
                const user: User | null = await session.load(req.subject);

                if (!user) {
                    res.status(404).json({ error: "User not found" });
                    return;
                }
                user.phone = req.body.phone;
                session.store(user, req.subject);
                session.saveChanges();
                res.status(200).json({ message: "Phone number verified" });
            })
            .catch((error) => {
                console.error("Error creating user: ", error);
                res.status(500).json({ error: "Internal Server Error" });
            });
    } catch (error) {
        console.error("Error verifying phone: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const setPassword = async (req: RequestWithUser, res: Response) => {
    connectDB()
        .then(async (store) => {
            const user: User | null = await store
                .openSession()
                .load(req.subject);

            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

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
        })
        .catch((error) => {
            console.error("Error loading user: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
};

const updatePassword = async (req: RequestWithUser, res: Response) => {
    try {
        if (!req.body.password || req.body.length > 1) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }
        await descopeClient?.management.user.setPassword(
            req.user?.email as string,
            req.body.password
        );
        setPassword(req, res);
    } catch (error) {
        console.error("Error changing password: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

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

export {
    profile,
    createUser,
    updateUser,
    deleteUser,
    updateEmail,
    verifyPhone,
    setPassword,
    updatePassword,
    logout,
    logoutAll,
};
