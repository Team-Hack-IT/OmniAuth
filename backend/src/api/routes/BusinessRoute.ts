import express from "express";
import businessMiddleware from "../middleware/BusinessMiddleware";
import {
    createBusiness,
    updateBusiness,
} from "../controller/BusinessController";
import {
    del,
    logout,
    logoutAll,
    profile,
    resetPassword,
    updateEmail,
    updatePassword,
    validatePassword,
} from "../controller/BaseController";

const router = express.Router();

router.post("/business/signup", createBusiness);

router.use("/api/business", businessMiddleware);
router.get("/api/business/profile", profile);
router.post("/api/business/update-password", updatePassword);
router.post("/api/business/verify-password", validatePassword);
router.post("/api/business/reset-password", resetPassword);
router.post("/api/business/update-email", updateEmail);
router.delete("/api/business/delete", del);
router.post("/api/business/update", updateBusiness);
router.get("/api/business/logout", logout);
router.get("/api/business/logout-all", logoutAll);

export default router;
