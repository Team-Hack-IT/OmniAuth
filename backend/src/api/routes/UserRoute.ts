import express, { Request, Response } from "express";
import {
    profile,
    createUser,
    updatePassword,
    updateEmail,
    deleteUser,
    updateUser,
    verifyPhone,
    logoutAll,
    logout,
} from "../controller/UserController";
import RequestWithUser from "../../types/request";
import { UserMiddleware } from "../middleware/UserMiddleware";

const router = express.Router();

router.post("/signup", (req: Request, res: Response) =>
    createUser(req as RequestWithUser, res)
);

router.use("/users", (req: Request, res: Response, next) => {
    UserMiddleware(req as RequestWithUser, res, next);
});

router.get("/users/profile", (req: Request, res: Response) =>
    profile(req as RequestWithUser, res)
);

router.post("/users/updatepassword", (req: Request, res: Response) =>
    updatePassword(req as RequestWithUser, res)
);

router.post("/users/updateemail", (req: Request, res: Response) =>
    updateEmail(req as RequestWithUser, res)
);

router.delete("/users/delete", (req: Request, res: Response) =>
    deleteUser(req as RequestWithUser, res)
);

router.post("/users/update", (req: Request, res: Response) =>
    updateUser(req as RequestWithUser, res)
);

router.post("/users/verifyphone", (req: Request, res: Response) =>
    verifyPhone(req as RequestWithUser, res)
);

router.get("/users/logoutall", (req: Request, res: Response) =>
    logoutAll(req as RequestWithUser, res)
);

router.get("/users/logout", (req: Request, res: Response) =>
    logout(req as RequestWithUser, res)
);

export default router;
