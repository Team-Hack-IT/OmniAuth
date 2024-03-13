import { Request, Response } from "express";
import {
    create,
    update,
    del,
    updateModelEmail,
    setPassword,
    validatePassword,
} from "./BaseController";
import connectDescope from "../../config/descope.config";
import supabase from "../../config/db.config";

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
        Object.keys(req.body).length != 8
    ) {
        res.status(400).json({ error: "Bad Request" });
        return;
    }

    await create(req, res, "users", {
        firstname,
        lastname,
        email,
        country,
        address,
        state,
        birthDate,
        postalCode,
        role: "user",
    });
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
    await update(req, res, "users", validKeys);
};

const deleteUser = async (req: Request, res: Response) => {
    await del(req, res, "users");
};

const updateEmail = async (req: Request, res: Response) => {
    await updateModelEmail(req, res, "users");
};

const verifyPhone = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { phone } = req.body;

        if (!phone || Object.keys(req.body).length != 1 || !user.email) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        const descopeClient = connectDescope(res);
        if (!descopeClient) {
            return;
        }
        descopeClient.otp.verify.sms(phone, user.email);

        const { error } = await supabase
            .from("users")
            .update({ phone })
            .eq("id", user.id);
        if (error) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        res.status(200).json({ message: "Phone Verified" });
    } catch (error) {
        console.error("Error verifying phone: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updatePassword = async (req: Request, res: Response) => {
    await setPassword(req, res, "users");
};

const verifyPassword = async (req: Request, res: Response) => {
    await validatePassword(req, res);
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
