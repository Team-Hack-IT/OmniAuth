import { Response, NextFunction } from "express";
import { UserMiddleware } from "../api/middleware/UserMiddleware";
import { describe, beforeEach, it } from "node:test";
import RequestWithUser from "../types/request";

describe("UserMiddleware Test", () => {
    let req: RequestWithUser;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            subject: "",
            token: "",
            user: null,
        } as RequestWithUser;
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    it("should call next() if user is found", async () => {
        const mockLoad = jest.fn().mockResolvedValueOnce({ id: "user1" });
        const mockOpenSession = jest
            .fn()
            .mockReturnValueOnce({ load: mockLoad });
        const mockConnectDB = jest
            .fn()
            .mockResolvedValueOnce({ openSession: mockOpenSession });
        jest.mock("../db", () => ({ connectDB: mockConnectDB }));

        req.subject = "user1";

        await UserMiddleware(req, res, next);

        expect(mockConnectDB).toHaveBeenCalled();
        expect(mockOpenSession).toHaveBeenCalled();
        expect(mockLoad).toHaveBeenCalledWith("user1");
        expect(req.user).toEqual({ id: "user1" });
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 404 error if user is not found", async () => {
        const mockLoad = jest.fn().mockResolvedValueOnce(null);
        const mockOpenSession = jest
            .fn()
            .mockReturnValueOnce({ load: mockLoad });
        const mockConnectDB = jest
            .fn()
            .mockResolvedValueOnce({ openSession: mockOpenSession });
        jest.mock("../db", () => ({ connectDB: mockConnectDB }));

        req.subject = "user1";

        await UserMiddleware(req, res, next);

        expect(mockConnectDB).toHaveBeenCalled();
        expect(mockOpenSession).toHaveBeenCalled();
        expect(mockLoad).toHaveBeenCalledWith("user1");
        expect(req.user).toBeUndefined();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "User Not Found" });
    });

    it("should return 500 error if an error occurs", async () => {
        const mockConnectDB = jest
            .fn()
            .mockRejectedValueOnce(new Error("Database connection failed"));
        jest.mock("../db", () => ({ connectDB: mockConnectDB }));

        await UserMiddleware(req, res, next);

        expect(mockConnectDB).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Internal Server Error",
        });
        expect(next).not.toHaveBeenCalled();
    });
});
