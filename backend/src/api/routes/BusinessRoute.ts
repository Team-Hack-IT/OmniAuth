import express from "express";
import BusinessMiddleware from "../middleware/BusinessMiddleware";
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
router.use("/business", BusinessMiddleware);
router.get("/business/profile", profile);
router.post("/users/business/update-password", updatePassword);
router.post("/business/verify-password", verifyPassword);
router.post("/business/update-email", updateEmail);
router.delete("/business/delete", deleteBusiness);
router.post("/business/update", updateBusiness);
router.get("/business/logout", logout);
router.get("/business/logoutall", logoutAll);

export default router;
