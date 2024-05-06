import userMiddleware from "../middleware/UserMiddleware";
import * as UserController from "../controller/UserController";
import * as BaseController from "../controller/BaseController";
import * as fileService from "../services/FileService";
import * as blockChainService from "../services/BlockchainService";
import { Router } from "express";

const router = Router();

router.post("/api/signup", UserController.createUser);
router.use("/api/user", userMiddleware);
router.get("/api/user/profile", BaseController.profile);
router.post("/api/user/update-password", BaseController.updatePassword);
router.post("/api/user/validate-password", BaseController.validatePassword);
router.post("/api/user/reset-password", BaseController.resetPassword);
router.post("/api/user/update-email", BaseController.updateEmail);
router.delete("/api/user/delete", BaseController.del);
router.post("/api/user/update", UserController.updateUser);
router.post("/api/user/verify-phone", UserController.verifyPhone);
router.post("/api/user/verify-id", fileService.verifyId);
router.get("/api/user/logout-all", BaseController.logoutAll);
router.get("/api/user/logout", BaseController.logout);
router.get("/api/user/service/get-all-business", UserController.getAllBusiness);
router.get("/api/user/files/download/:type", fileService.downloadFile);
router.post("/api/user/files/upload/:type", fileService.uploadDocument);
router.post("/api/user/upload-picture", fileService.uploadPicture);
router.delete("/api/user/files/delete/:type", fileService.deleteDocument);
router.get(
    "/api/user/service/generate-unique-id",
    blockChainService.generateUniqueId
);

export default router;
