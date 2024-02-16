import { Request, Response } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import DescopeClient from "@descope/node-sdk";
import DocumentStore from "ravendb";
import User from "../model/User";
import { connectDB } from "../../config/db.config";

dotenv.config();

const dbUrl = process.env.DB_URL || "";
const certPath = process.env.CERT_PATH || "";
let store: DocumentStore | null = null;

connectDB(certPath, dbUrl)
    .then((s) => {
        store = s;
    })
    .catch((error) => {
        throw error;
    });

const descopeClient = DescopeClient({
    projectId: process.env.PROJECT_ID || "None",
});

const verifyEmail = async (req: Request, res: Response) => {
    await descopeClient.otp.signUp["email"](req.body.email);
};

const verifyPhoneNo = async (req: Request, res: Response) => {
    await descopeClient.otp.signUp["sms"](req.body.phone);
};

const googleSignIn = async (req: Request, res: Response) => {
    const urlRes = await descopeClient.oauth.start["google"]();
    urlRes.data?.url;
    const jwtResponse = await descopeClient.oauth.exchange("token");
    req.cookies.sessionToken = jwtResponse.data?.sessionJwt;
    req.cookies.refreshToken = jwtResponse.data?.refreshJwt;
};

const microsoftSignIn = async (req: Request, res: Response) => {
    const urlRes = await descopeClient.oauth.start["microsoft"]();
    urlRes.data?.url;
    const jwtResponse = await descopeClient.oauth.exchange("token");
    req.cookies.sessionToken = jwtResponse.data?.sessionJwt;
    req.cookies.refreshToken = jwtResponse.data?.refreshJwt;
};

const emailSignIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const jwtResponse = await descopeClient.password.signIn(
            email,
            password
        );
        const user = await store
            ?.openSession()
            .query({ collection: "Users" })
            .whereEquals("email", email)
            .firstOrNull();

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        req.cookies.sessionToken = jwtResponse.data?.sessionJwt;
        req.cookies.refreshToken = jwtResponse.data?.refreshJwt;

        store?.dispose();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const emailSignUp = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, phone, email, password } = req.body;
        bcrypt
            .hash(password, 12)
            .then(async (hash) => {
                const user = new User(firstName, lastName, phone, email, hash);
                const jwtResponse = await descopeClient.password.signUp(
                    email,
                    hash,
                    user
                );

                req.cookies.sessionToken = jwtResponse.data?.sessionJwt;
                req.cookies.refreshToken = jwtResponse.data?.refreshJwt;

                store?.openSession().store(user);
                store?.dispose();
            })
            .catch((error) => {
                res.status(500).json({ error: "Internal Server Error" });
            });
    } catch (error) {
        res.status(401).json({ error: "Bad Request" });
    }
};
const logout = async (req: Request, res: Response) => {
    await descopeClient.logout(
        req.cookies[DescopeClient.SessionTokenCookieName]
    );
    res.status(200).json({ message: "Logged out" });
};

const logoutAll = async (req: Request, res: Response) => {
    await descopeClient.logoutAll(
        req.cookies[DescopeClient.SessionTokenCookieName]
    );
    res.status(200).json({ message: "Logged out across all devices" });
};

const updatePassword = async (req: Request, res: Response) => {
    await descopeClient.logoutAll;
    res.status(200).json({ message: "Logged out across all devices" });
};

const signUp = async (req: Request, res: Response) => {
    switch (req.params.method) {
        case "email":
            emailSignUp(req, res);
            verifyEmail(req, res);
            break;
    }
};

const login = async (req: Request, res: Response) => {
    switch (req.params.method) {
        case "email":
            emailSignIn(req, res);
            break;
        case "google":
            googleSignIn(req, res);
            break;
        case "microsoft":
            microsoftSignIn(req, res);
            break;
    }
};

export { logout, logoutAll, login, signUp };
