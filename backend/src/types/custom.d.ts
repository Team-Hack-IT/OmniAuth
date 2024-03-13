import { Request } from "express";
import User from "../api/model/User";

declare module "express-serve-static-core" {
    export interface Request {
        subject: string;
        token: string;
        user?: any;
    }
}
