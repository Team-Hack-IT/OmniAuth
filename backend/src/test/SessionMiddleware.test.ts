import { Response, NextFunction } from "express";
import { sessionMiddleware } from "../api/middleware/SessionMiddleware";
import { describe, beforeEach, it } from "node:test";
import RequestWithUser from "../types/request";

describe("SessionMiddleware Test", () => {
    let req: RequestWithUser;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {
                authorization: "Bearer token123",
            },
            ip: "127.0.0.1",
            token: "",
            subject: "",
            user: null,
        } as RequestWithUser;
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;
        next = jest.fn();
    });

    it("should call next() if session is successfully validated", async () => {
        const mockValidateSession = jest
            .fn()
            .mockResolvedValueOnce({ token: { sub: "user1" } });
        const mockConnectDescope = jest
            .fn()
            .mockReturnValueOnce({ validateSession: mockValidateSession });
        jest.mock("../api/middleware/SessionMiddleware", () => ({
            connectDescope: mockConnectDescope,
        }));

        await sessionMiddleware(req, res, next);

        expect(mockConnectDescope).toHaveBeenCalled();
        expect(mockValidateSession).toHaveBeenCalledWith("token123");
        expect(req.token).toBe("token123");
        expect(req.subject).toBe("user1");
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 401 error if token is missing", async () => {
        req.headers.authorization = undefined;

        await sessionMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 500 error if descope client is not available", async () => {
        const mockConnectDescope = jest.fn().mockReturnValueOnce(null);
        jest.mock("../api/middleware/SessionMiddleware", () => ({
            connectDescope: mockConnectDescope,
        }));

        await sessionMiddleware(req, res, next);

        expect(mockConnectDescope).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Internal Server Error",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 error if session validation fails", async () => {
        const mockValidateSession = jest.fn().mockResolvedValueOnce(null);
        const mockConnectDescope = jest
            .fn()
            .mockReturnValueOnce({ validateSession: mockValidateSession });
        jest.mock("../api/middleware/SessionMiddleware", () => ({
            connectDescope: mockConnectDescope,
        }));

        await sessionMiddleware(req, res, next);

        expect(mockConnectDescope).toHaveBeenCalled();
        expect(mockValidateSession).toHaveBeenCalledWith("token123");
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 500 error if token.sub is missing", async () => {
        const mockValidateSession = jest
            .fn()
            .mockResolvedValueOnce({ token: {} });
        const mockConnectDescope = jest
            .fn()
            .mockReturnValueOnce({ validateSession: mockValidateSession });
        jest.mock("../api/middleware/SessionMiddleware", () => ({
            connectDescope: mockConnectDescope,
        }));

        await sessionMiddleware(req, res, next);

        expect(mockConnectDescope).toHaveBeenCalled();
        expect(mockValidateSession).toHaveBeenCalledWith("token123");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Internal Server Error",
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 500 error if an error occurs during session validation", async () => {
        const mockConnectDescope = jest.fn().mockReturnValueOnce({
            validateSession: jest
                .fn()
                .mockRejectedValueOnce(new Error("Session validation failed")),
        });
        jest.mock("../api/middleware/SessionMiddleware", () => ({
            connectDescope: mockConnectDescope,
        }));

        await sessionMiddleware(req, res, next);

        expect(mockConnectDescope).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Internal Server Error",
        });
        expect(next).not.toHaveBeenCalled();
    });
});
