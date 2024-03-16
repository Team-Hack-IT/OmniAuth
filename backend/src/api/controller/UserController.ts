import { NextFunction, Request, Response } from "express";
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

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
            throw new Error("Bad Request");
        }

        await create(req.subject, "users", {
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
        res.status(201).json({ message: "User Created" });
    } catch (error) {
        next(error);
    }
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
        const isPhoneNumber = /^\+[1-9]\d{10,14}$/.test(phone);

        if (
            !phone ||
            Object.keys(req.body).length != 1 ||
            !user.email ||
            !isPhoneNumber
        ) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        const descopeClient = connectDescope();
        if (!descopeClient) {
            return;
        }

        await descopeClient.otp.signUpOrIn.sms(phone, req.token);

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
