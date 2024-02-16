import express from "express";
import { login, logout, logoutAll, signUp } from "../controller/AuthController";

const router = express.Router();

router.post("/login/:method", login);
router.post("/signup/:method", signUp);
router.post("/logoutall", logoutAll);
router.post("/logout", logout);

export default router;