import { Router } from "express";
import AuthRoute from "../routes/AuthRoute";

const router = Router();

router.use("/", AuthRoute);

export default router;