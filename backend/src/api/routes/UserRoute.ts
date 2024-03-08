import express from "express";
import {
    createUser,
    updatePassword,
    updateEmail,
    deleteUser,
    updateUser,
    verifyPhone,
    verifyPassword,
} from "../controller/UserController";
import { profile, logout, logoutAll } from "../controller/BaseController";
import UserMiddleware from "../middleware/UserMiddleware";

const router = express.Router();

router.post("/signup", createUser);
router.use("/users", UserMiddleware);
router.get("/users/profile", profile);
router.post("/users/update-password", updatePassword);
router.post("/users/update-email", updateEmail);
router.delete("/users/delete", deleteUser);
router.post("/users/update", updateUser);
router.post("/users/verify-password", verifyPassword);
router.post("/users/verify-phone", verifyPhone);
router.get("/users/logoutall", logoutAll);
router.get("/users/logout", logout);

export default router;
