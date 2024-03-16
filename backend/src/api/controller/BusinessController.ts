import { NextFunction, Request, Response } from "express";
import { create, update } from "../../utils/model";
import { BadRequest } from "../../utils/error";

const createBusiness = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            name,
            email,
            country,
            address,
            city,
            state,
            postalCode,
            website,
            description,
            tier,
            industry,
        } = req.body;

        if (
            !name ||
            !email ||
            !country ||
            !address ||
            !city ||
            !state ||
            !postalCode ||
            !website ||
            !description ||
            !industry ||
            !tier ||
            req.body.length !== 11
        ) {
            throw new BadRequest();
        }

        await create(req.subject, "business", {
            name,
            email,
            address,
            city,
            state,
            country,
            postalCode,
            website,
            industry,
            description,
            tier,
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
            "postalCode",
            "industry",
        ];

        await update(req.user.role, req.body, "user", validAttributes);
        res.status(200).json({ message: "User Succesfully Updated" });
    } catch (error) {
        next(error);
    }
};

export { createBusiness, updateBusiness };
