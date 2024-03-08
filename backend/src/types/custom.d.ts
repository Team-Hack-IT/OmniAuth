import { Request } from "express";
import User from "../api/model/User";
import Business from "../api/model/Business";

declare module "express-serve-static-core" {
    export interface Request {
        subject?: string;
        token?: string;
        user?: User | Business;
    }
}
