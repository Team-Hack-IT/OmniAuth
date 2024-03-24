import { User, Business } from "./model.types";

declare global {
    namespace Express {
        export interface Request {
            subject: string;
            token: string;
            user: User | Business;
        }
    }
}
