import { NextFunction, Request, Response } from "express";
import { create, update } from "../../utils/model";
import { BadRequest } from "../../utils/error";

const createBusiness = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const requiredAttributes = [
            "name",
            "email",
            "country",
            "address",
            "city",
            "state",
            "postal_code",
            "website",
            "description",
            "industry",
            "tier",
        ];

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

        await create(req.subject, "business", {
            ...body,
            role: "business",
        });
        res.status(201).json({ message: "User Created" });
    } catch (error) {
        next(error);
    }
};

const updateBusiness = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validAttributes = [
            "country",
            "city",
            "state",
            "address",
            "postal_code",
            "industry",
        ];

        await update(req.user.role, req.body, "user", validAttributes);
        res.status(200).json({ message: "User Succesfully Updated" });
    } catch (error) {
        next(error);
    }
};

const generateAPIKey = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};

export { createBusiness, updateBusiness };
