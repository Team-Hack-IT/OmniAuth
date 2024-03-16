import express from "express";
import {
    createUser,
    updateUser,
    verifyPhone,
} from "../controller/UserController";
import {
    profile,
    del,
    validatePassword,
    resetPassword,
    updatePassword,
    updateEmail,
    logout,
    logoutAll,
} from "../controller/BaseController";
import userMiddleware from "../middleware/UserMiddleware";

const router = express.Router();

router.post("/signup", createUser);
router.use("/users", userMiddleware);
router.get("/users/profile", profile);
router.post("/users/update-password", updatePassword);
router.post("/users/update-email", updateEmail);
router.delete("/users/delete/", del);
router.post("/users/update", updateUser);
router.post("/users/validate-password", validatePassword);
router.post("/users/verify-phone", verifyPhone);
router.get("/users/logoutall", logoutAll);
router.get("/users/logout", logout);

export default router;
