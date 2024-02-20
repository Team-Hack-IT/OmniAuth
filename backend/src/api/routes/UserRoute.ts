import express, { Request, Response } from "express";
import {
    logout,
    logoutAll,
    profile,
    updatePassword,
    createUser,
    deleteUser,
    updateEmail,
} from "../controller/UserController";
import RequestWithUser from "../../types/request";
import { UserMiddleware } from "../middleware/UserMiddleware";

const router = express.Router();

router.post("/create", (req: Request, res: Response) =>
    createUser(req as RequestWithUser, res)
);

router.use((req, res, next) => {
    UserMiddleware(req as RequestWithUser, res, next);
});

router.get("/profile", (req: Request, res: Response) =>
    profile(req as RequestWithUser, res)
);
router.get("/logoutall", (req: Request, res: Response) =>
    logoutAll(req as RequestWithUser, res)
);
router.get("/logout", (req: Request, res: Response) =>
    logout(req as RequestWithUser, res)
);
router.post("/updatepassword", (req: Request, res: Response) =>
    updatePassword(req as RequestWithUser, res)
);
router.post("/updateemail", (req: Request, res: Response) =>
    updateEmail(req as RequestWithUser, res)
);
router.delete("/delete", (req: Request, res: Response) =>
    deleteUser(req as RequestWithUser, res)
);

export default router;
