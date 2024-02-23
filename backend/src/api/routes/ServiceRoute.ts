import Router from "express";
import multer from "multer";
import { uploadFile, downloadFile, verifyId } from "../services/FileService";
import { UserMiddleware } from "../middleware/UserMiddleware";

const router = Router();
router.use((req, res) => {
    UserMiddleware;
});
const upload = multer();

router.post("/users/verify-id", upload.single("identityCard"), (req, res) => {
    verifyId;
});

router.post("/users/upload/:type", upload.single(""), (req, res) => {
    uploadFile;
});

router.get("/users/download/:type", (req, res) => {
    downloadFile;
});

export default router;
