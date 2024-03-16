import express from "express";
import businessMiddleware from "../middleware/BusinessMiddleware";
import {
    createBusiness,
    deleteBusiness,
    updateBusiness,
    updateEmail,
    updatePassword,
    verifyPassword,
} from "../controller/BusinessController";
import { logout, logoutAll, profile } from "../controller/BaseController";

const router = express.Router();

router.post("/business/signup", createBusiness);
router.use("/business", businessMiddleware);
router.get("/business/profile", profile);
router.post("/business/update-password", updatePassword);
router.post("/business/verify-password", verifyPassword);
router.post("/business/update-email", updateEmail);
router.delete("/business/delete", deleteBusiness);
router.post("/business/update", updateBusiness);
router.get("/business/logout", logout);
router.get("/business/logoutall", logoutAll);

export default router;
