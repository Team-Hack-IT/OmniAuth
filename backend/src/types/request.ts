import { Request } from "express";
import User from "../api/model/User";

type RequestWithUser = {
    subject: string;
    token: string;
    user: User | null;
} & Request;

export default RequestWithUser;
