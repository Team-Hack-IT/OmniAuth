import Router from "express";
import multer from "multer";
import { uploadFile, downloadFile, verifyId } from "../services/FileService";
import UserMiddleware from "../middleware/UserMiddleware";

const router = Router();
const upload = multer();

router.use(UserMiddleware);
router.post("/users/verify-id", upload.single("idCard"), verifyId);
router.post("/users/upload/:type", upload.single(""), uploadFile);
router.get("/users/download/:type", downloadFile);

export default router;
