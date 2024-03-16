import { NextFunction, Request, Response } from "express";
import { create, update } from "../../utils/model";
import connectDescope from "../../config/descope.config";
import supabase from "../../config/db.config";
import { BadRequest, ServerError } from "../../utils/error";

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
            throw new BadRequest();
        }

        await create(req.subject, "user", {
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

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validAttributes = [
            "firstname",
            "lastname",
            "country",
            "state",
            "city",
            "address",
            "postalCode",
            "birthDate",
        ];
        await update(req.user.role, req.body, "user", validAttributes);
        res.status(200).json({ message: "User Succesfully Updated" });
    } catch (error) {
        next(error);
    }
};

const verifyPhone = async (req: Request, res: Response, next: NextFunction) => {
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
            throw new Error("Bad Request");
        }

        await connectDescope().otp.signUpOrIn.sms(phone);

        const { error } = await supabase
            .from("user")
            .update({ phone })
            .eq("id", user.id);

        if (error) throw new ServerError();

        res.status(200).json({ message: "Phone Verified" });
    } catch (error) {
        next(error);
    }
};

export { createUser, updateUser, verifyPhone };
