import Router from "express";
import multer from "multer";
import { uploadFile, downloadFile, verifyId } from "../../services/FileService";

const router = Router();
const upload = multer();

/**router.post("/users/verify-identity", upload.single("identityCard"), verifyId);

router.get("/users/download/:type", downloadFile);

router.post("/users/upload/:type", upload.single("file"), uploadFile);
export default router;
**/
export default router;