import { Request } from "express";
import User from "../api/model/User";

interface RequestWithUser extends Request {
    subject: string;
    token: string;
    user: User | null;
}

export default RequestWithUser;
