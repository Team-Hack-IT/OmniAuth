import express from "express";
import UserController from "../controller/UserController";

const router = express.Router();

router.post("/login", UserController.login);
router.post("/logout", UserController.logout);

export default router;