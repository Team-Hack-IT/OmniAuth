import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err.message);
    switch (err.message) {
        case "Internal Server Error":
            res.status(500).json({ error: "Internal Server Error" });
            break;

        case "User Not Found":
            res.status(404).json({ error: "User Not Found" });
            break;

        case "Bad Request":
            res.status(400).json({ error: "Bad Request" });
            break;

        default:
            res.status(500).json({ error: "Internal Server Error" });
            break;
    }
};

export default errorMiddleware;
