import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import connectDescope from "../../config/descope.config";
import supabase from "../../config/db.config";
import * as querystring from "querystring";
import {
    BadRequest,
    NotFound,
    ServerError,
    Unauthorized,
} from "../../utils/error";

const profile = async (req: Request, res: Response) => {
    delete req.user.password;
    delete req.user.subject;
    res.status(200).json(req.user);
};

const del = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = querystring.unescape(req.query.email as string);
        const pattern =
            /^[a-za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-za-z0-9](?:[a-za-z0-9-]{0,61}[a-za-z0-9])?(?:\.[a-za-z0-9](?:[a-za-z0-9-]{0,61}[a-za-z0-9])?)*$/;
        const isValidEmail = pattern.test(email);

        if (!email || !isValidEmail) throw new BadRequest();
        if (!email) throw new BadRequest();

        const descopeClient = connectDescope();
        await descopeClient.logoutAll(req.token);
        await descopeClient.management.user.delete(email);

        const { error } = await supabase
            .from(req.user.role)
            .delete()
            .eq("id", req.user.id);

        if (error) throw new ServerError();

        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        next(error);
    }
};

const updateEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const pattern =
            /^[a-za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-za-z0-9](?:[a-za-z0-9-]{0,61}[a-za-z0-9])?(?:\.[a-za-z0-9](?:[a-za-z0-9-]{0,61}[a-za-z0-9])?)*$/;
        const isValidEmail = pattern.test(email);

        if (!email || !req.token || !isValidEmail) throw new BadRequest();

        await connectDescope().magicLink.update.email(
            req.user.email,
            email,
            req.token
        );

        const { error } = await supabase
            .from(req.user.role)
            .update({ email })
            .eq("id", req.user.id);

        if (error) throw new ServerError();

        res.status(200).json({ message: "Email Successfully Updated" });
    } catch (error) {
        next(error);
    }
};

const updatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await setPassword(req, (email: string, hash: string, token: string) => {
            connectDescope()
                .password.update(email, hash, token)
                .catch(() => {
                    throw new ServerError();
                });
        });
        res.status(200).json({ message: "Password Updated Successfully" });
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await setPassword(req, (email: string) => {
            connectDescope()
                .password.sendReset(email, "http://omni-auth.vercel.app/")
                .catch(() => {
                    throw new ServerError();
                });
        });
        res.status(200).json({ message: "Password Succesfully Changed" });
    } catch (error) {
        next(error);
    }
};

const setPassword = async (
    req: Request,
    cb: (email: any, hash?: any, token?: any) => void
) => {
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

        await cb(email, hash, req.token);
        const { error } = await supabase
            .from(req.user.role)
            .update({ password: hash })
            .eq("id", req.user.id);

        if (error) throw new Error("Internal Server Error");
    } catch (error) {
        throw new Error("Internal Server Error");
    }
};

const validatePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { password } = req.user;

        if (Object.keys(req.body).length != 1) throw new BadRequest();
        if (!password) throw new NotFound();

        await bcrypt
            .compare(req.body.password, password)
            .then((value) => {
                if (!value) throw new Unauthorized();
                return true;
            })
            .catch(() => {
                throw new ServerError();
            });
        res.status(200).json({ message: "Password Succesfully Validated" });
    } catch (error) {
        next(error);
    }
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
    del,
    updateEmail,
    updatePassword,
    resetPassword,
    validatePassword,
    logout,
    logoutAll,
};
