import { Request, Response } from "express";
import {
    create,
    update,
    del,
    updateModelEmail,
    setPassword,
    validatePassword,
} from "./BaseController";
import connectDB from "../../config/db.config";
import connectDescope from "../../config/descope.config";
import User from "../model/User";

const descopeClient = connectDescope();

const createUser = async (req: Request, res: Response) => {
    const {
        firstname,
        lastname,
        email,
        country,
        address,
        state,
        birthDate,
        postalCode,
    } = req.body;

    if (
        !firstname ||
        !lastname ||
        !email ||
        !country ||
        !address ||
        !state ||
        !postalCode ||
        !birthDate ||
        req.body.length !== 8
    ) {
        res.status(400).json({ error: "Bad Request" });
        return;
    }

    const newUser: User = {
        firstname,
        lastname,
        email,
        address,
        state,
        country,
        postalCode,
        birthDate,
        role: "user",
        createdAt: new Date(),
    };

    await create(req, res, newUser);
};

const updateUser = async (req: Request, res: Response) => {
    const validKeys = [
        "firstname",
        "lastname",
        "email",
        "country",
        "state",
        "city",
        "address",
        "postalCode",
        "birthDate",
    ];
    await update(req, res, req.user as User, validKeys);
};

const deleteUser = async (req: Request, res: Response) => {
    await del(req, res, req.user as User);
};

const updateEmail = async (req: Request, res: Response) => {
    await updateModelEmail(req, res, req.user as User);
};

const verifyPhone = async (req: Request, res: Response) => {
    try {
        const user = req.user as User;
        const { phone } = req.body;

        if (phone || req.body.length > 1) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }
        if (!user.email) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        await descopeClient?.otp.verify.sms(user.email, phone);
        connectDB()
            .then(async (store) => {
                const session = store.openSession();
                user.phone = phone;
                session.store(user, req.subject);
                session.saveChanges();
                session.dispose();
                res.status(200).json({ message: "Phone number verified" });
            })
            .catch(() => {
                res.status(500).json({ error: "Internal Server Error" });
            });
    } catch (error) {
        console.error("Error verifying phone: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updatePassword = async (req: Request, res: Response) => {
    await setPassword(req, res, req.user as User);
};

const verifyPassword = async (req: Request, res: Response) => {
    await validatePassword(req, res, req.user as User);
};

export {
    createUser,
    updateUser,
    deleteUser,
    updateEmail,
    verifyPhone,
    updatePassword,
    verifyPassword,
};
