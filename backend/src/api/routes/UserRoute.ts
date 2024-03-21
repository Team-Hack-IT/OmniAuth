import express from "express";
import {
    createUser,
    updateUser,
    verifyPhone,
    getAllBusiness,
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

router.post("/api/signup", createUser);
router.use("/api/user", userMiddleware);
router.get("/api/user/profile", profile);
router.post("/api/user/update-password", updatePassword);
router.post("/api/user/validate-password", validatePassword);
router.post("/api/user/reset-password", resetPassword);
router.post("/api/user/update-email", updateEmail);
router.delete("/api/user/delete", del);
router.post("/api/user/update", updateUser);
router.post("/api/user/verify-phone", verifyPhone);
router.get("/api/user/logout-all", logoutAll);
router.get("/api/user/logout", logout);
router.get("/api/user/get-all-business", getAllBusiness);

export default router;
