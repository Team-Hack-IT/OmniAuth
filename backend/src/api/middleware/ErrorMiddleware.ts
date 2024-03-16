import { Request, Response, NextFunction } from "express";
import errorCodes from "../../utils/errorCodes";

const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const message = err.message;
    const errorCode = errorCodes[message as keyof typeof errorCodes];
    res.status(errorCode).json({ error: message });
};

export default errorMiddleware;
