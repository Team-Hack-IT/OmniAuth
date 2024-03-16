import { NextFunction, Request, Response } from "express";
import { SdkResponse } from "@descope/node-sdk";
import bcrypt from "bcrypt";
import connectDescope from "../../config/descope.config";
import * as querystring from "querystring";
import supabase from "../../config/db.config";
import loadData from "../../utils/loadData";

const profile = async (req: Request, res: Response) => {
    const [password, subject, ...rest] = req.user;
    res.status(200).json(rest);
};

const create = async (subject: string, table: string, obj: object) => {
    const data = await loadData(subject, table);

    if (data) throw new Error("User already exists");

    const { error } = await supabase.from(table).insert([
        {
            subject: subject,
            ...obj,
        },
    ]);

    if (error) throw new Error("Internal Server Error");
};

const update = async (
    subject: string,
    attributes: object,
    table: string,
    validAttributes: string[]
) => {
    for (const key in attributes) {
        let index = validAttributes.indexOf(key);
        if (index === -1) throw new Error("Bad Request");
    }

    const { error } = await supabase
        .from(table)
        .update(attributes)
        .eq("subject", subject);

    if (error) throw new Error("Internal Server Error");
};

const del = async (req: Request, table: string) => {
    try {
        const email = querystring.escape(req.query.email as string);

        if (!email) throw new Error("Bad Request");

        const descopeClient = connectDescope();
        await descopeClient.logoutAll(req.token);
        await descopeClient.management.user.delete(email);

        const { error } = await supabase
            .from(table)
            .delete()
            .eq("subject", req.subject);

        if (error) throw new Error("Internal Server Error");
    } catch (error) {
        throw new Error("Internal Server Error");
    }
};

const updateModelEmail = async (req: Request, table: string) => {
    try {
        const { email } = req.body;
        const pattern =
            /^[a-za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-za-z0-9](?:[a-za-z0-9-]{0,61}[a-za-z0-9])?(?:\.[a-za-z0-9](?:[a-za-z0-9-]{0,61}[a-za-z0-9])?)*$/;
        const isValidEmail = pattern.test(email);

        if (!email || !req.token || !isValidEmail)
            throw new Error("Bad Request");

        const descopeClient = connectDescope();
        await descopeClient.magicLink.update.email(
            req.user.email,
            email,
            req.token
        );

        const { error } = await supabase
            .from(table)
            .update({ email })
            .eq("subject", req.subject);

        if (error) throw new Error("Internal Server Error");
    } catch (error) {
        throw new Error("Internal Server Error");
    }
};

const setPassword = async (req: Request, table: string) => {
    try {
        const { email } = req.user;
        const { password } = req.body;
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        const isStrong = pattern.test(password);

        if (
            !password ||
            !email ||
            Object.keys(req.body).length != 1 ||
            !isStrong
        ) {
            throw new Error("Bad Request");
        }

        const hash = await bcrypt.hash(password, 10).catch(() => {
            throw new Error("Internal Server Error");
        });

        await connectDescope()
            .password.update(email, hash, req.token)
            .catch(() => {
                throw new Error("Internal Server Error");
            });
    } catch (error) {
        throw new Error("Internal Server Error");
    }
};

const validatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { password } = req.user;

    if (Object.keys(req.body).length != 1) throw new Error("Bad Request");
    if (!password) throw new Error("Not Found");

    await bcrypt
        .compare(req.body.password, password)
        .then((value) => {
            if (!value) throw new Error("Unathorized");
            return true;
        })
        .catch(() => {
            throw new Error("Internal Server Error");
        });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await connectDescope().logout(req.token);
        res.json({ message: "Logged out" });
    } catch (error) {
        next(error);
    }
};

const logoutAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await connectDescope().logoutAll(req.token);
        res.json({ message: "Logged out" });
    } catch (error) {
        next(error);
    }
};

export {
    profile,
    create,
    update,
    del,
    updateModelEmail,
    setPassword,
    validatePassword,
    logout,
    logoutAll,
};
