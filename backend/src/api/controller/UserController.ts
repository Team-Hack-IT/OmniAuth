import { Request, Response } from "express";
import DescopeClient from "@descope/node-sdk";
import User from "../model/User";

class UserController {
    private descopeClient;

    constructor() {
        this.descopeClient = DescopeClient({
            projectId: process.env.PROJECT_ID || "None",
        });
    }

    public async login(req: Request, res: Response) {
        const { firstName, lastName, email, phone, password } = req.body;
        const user = new User(firstName, lastName, email, phone, password);

        try {
            await this.descopeClient.password.signUp(email, password, user);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: "User Not Found" });
        }
    }

    public async logout(req: Request, res: Response) {
        await this.descopeClient.logout(
            req.cookies[DescopeClient.SessionTokenCookieName]
        );
        res.status(200).json({ message: "Logged out" });
    }

    public async logoutAll(req: Request, res: Response) {
        await this.descopeClient.logoutAll(
            req.cookies[DescopeClient.SessionTokenCookieName]
        );
        res.status(200).json({ message: "Logged out across all devices" });
    }
}

export default new UserController();