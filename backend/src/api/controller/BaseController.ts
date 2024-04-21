import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import connectDescope from "../../config/descope.config";
import supabase from "../../config/db.config";
import {
    BadRequest,
    NotFound,
    ServerError,
    Unauthorized,
} from "../../utils/error";
import { deleteBucket } from "../../utils/file";

const profile = async (req: Request, res: Response) => {
    const { password, subject, bucketId, ...user } = req.user;
    res.status(200).json(user);
};

const del = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, id, role } = req.user;

        if (!email) throw new BadRequest("Email not found");

        const descopeClient = connectDescope();
        await descopeClient.logoutAll(req.token);
        await descopeClient.management.user.delete(email);

        const { error } = await supabase.from(role).delete().eq("id", id);

        if (error) throw new ServerError();

        deleteBucket(req.user.id);
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        next(error);
    }
};

const updateEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const { id, role, email: userEmail } = req.user;
        const pattern =
            /^[a-za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-za-z0-9](?:[a-za-z0-9-]{0,61}[a-za-z0-9])?(?:\.[a-za-z0-9](?:[a-za-z0-9-]{0,61}[a-za-z0-9])?)*$/;
        const isValidEmail = pattern.test(email);

        if (!email || !req.token || !isValidEmail) throw new BadRequest();

        await connectDescope().magicLink.update.email(
            userEmail,
            email,
            req.token
        );

        const { error } = await supabase
            .from(role)
            .update({ email })
            .eq("id", id);

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
        await setPassword(req, async (email, hash, token) => {
            if (!hash) throw new ServerError();
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
        await setPassword(req, async (email, hash) => {
            connectDescope()
                .management.user.setPassword(email, hash)
                //sendReset(email, "http://omni-auth.vercel.app/")
                .catch(() => {
                    throw new ServerError();
                })
                .then((response) => {
                    console.log(response);
                });
        });
        res.status(200).json({ message: "Password Succesfully Changed" });
    } catch (error) {
        next(error);
    }
};

const setPassword = async (
    req: Request,
    cb: (email: string, hash: string, token?: string) => Promise<void>
) => {
    try {
        const { id, role, email } = req.user;
        const { password } = req.body;
        const pattern =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const isStrong = pattern.test(password);
        const length = Object.keys(req.body).length;

        if (!isStrong) throw new BadRequest("Weak password");
        if (!password || !email || length != 1) throw new BadRequest();

        const hash = await bcrypt.hash(password, 10).catch(() => {
            throw new ServerError();
        });

        await cb(email, hash, req.token);

        const { error } = await supabase
            .from(role)
            .update({ password: hash })
            .eq("id", id);

        if (error) throw new ServerError();
    } catch (error) {
        throw error;
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
        if (!password) throw new NotFound("Password Not Set");

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
