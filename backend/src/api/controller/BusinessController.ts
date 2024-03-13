import { Request, Response } from "express";
import {
    create,
    update,
    del,
    updateModelEmail,
    setPassword,
    validatePassword,
} from "./BaseController";

const createBusiness = async (req: Request, res: Response) => {
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
        res.status(400).json({ error: "Bad Request" });
        return;
    }

    await create(req, res, "business", {
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
};

const updateBusiness = async (req: Request, res: Response) => {
    const validKeys = [
        "firstname",
        "lastname",
        "email",
        "country",
        "city",
        "state",
        "address",
        "postalCode",
        "industry",
    ];
    await update(req, res, "business", validKeys);
};

const deleteBusiness = async (req: Request, res: Response) => {
    await del(req, res, "business");
};

const updateEmail = async (req: Request, res: Response) => {
    await updateModelEmail(req, res, "business");
};

const updatePassword = async (req: Request, res: Response) => {
    await setPassword(req, res, "business");
};

const verifyPassword = async (req: Request, res: Response) => {
    await validatePassword(req, res);
};

export {
    createBusiness,
    updateBusiness,
    deleteBusiness,
    updateEmail,
    updatePassword,
    verifyPassword,
};