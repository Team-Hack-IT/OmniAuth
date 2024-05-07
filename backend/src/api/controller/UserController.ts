import connectDescope from "@/config/descope.config";
import supabase from "@/config/db.config";
import * as blockchainService from "@/services/BlockchainService";
import { create, update } from "@/utils/model";
import { Request, Response, NextFunction } from "express";
import { BadRequest, ServerError } from "@/utils/error";
import { User } from "../../@types/model.types";

const requiredAttributes = [
    "firstname",
    "lastname",
    "email",
    "address",
    "city",
    "state",
    "country",
    "birth_date",
    "postal_code",
];

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body } = req;
        const hasAllRequiredAttributes = requiredAttributes.every(
            (attr) => body[attr]
        );
        if (
            !hasAllRequiredAttributes ||
            Object.keys(body).length !== requiredAttributes.length
        ) {
            throw new BadRequest();
        }

        const user = {
            ...body,
            role: "user",
        };

        await create(req.subject, "user", user);
        res.status(201).json({ message: "User Created" });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [email, ...validAttributes] = requiredAttributes;
        await update(req.subject, req.body, "user", validAttributes);
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
        const length = Object.keys(req.body).length;

        if (!phone || length != 1 || !isPhoneNumber) {
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

const getAllBusiness = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { data, error } = await supabase
            .from("business")
            .select("id, name, website, industry, description");

        if (error) throw new ServerError();

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

const generateUniqueId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as User;

        if (user.is_verified) {
            const id = blockchainService.generateUniqueId();
            const { error } = await supabase
                .from("user")
                .update({ id })
                .eq("id", user.id);

            if (error) throw new ServerError();
            return id;
        }
    } catch (error) {
        next(error);
    }
};
export { createUser, updateUser, verifyPhone, getAllBusiness };
