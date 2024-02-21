import express, { Request, Response } from "express";
import {
    profile,
    createUser,
    updatePassword,
    updateEmail,
    deleteUser,
    updateUser,
    verifyPhone,
    logoutAll,
    logout,
} from "../controller/UserController";
import RequestWithUser from "../../types/request";
import { UserMiddleware } from "../middleware/UserMiddleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
router.post("users/create", (req: Request, res: Response) =>
    createUser(req as RequestWithUser, res)
);

router.use((req, res, next) => {
    UserMiddleware(req as RequestWithUser, res, next);
});

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/profile", (req: Request, res: Response) =>
    profile(req as RequestWithUser, res)
);

/**
 * @swagger
 * /users/updatepassword:
 *   post:
 *     summary: Update user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("users/updatepassword", (req: Request, res: Response) =>
    updatePassword(req as RequestWithUser, res)
);

/**
 * @swagger
 * /users/updateemail:
 *   post:
 *     summary: Update user email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmailRequest'
 *     responses:
 *       200:
 *         description: Email updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("users/updateemail", (req: Request, res: Response) =>
    updateEmail(req as RequestWithUser, res)
);

/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.delete("users/delete", (req: Request, res: Response) =>
    deleteUser(req as RequestWithUser, res)
);

/**
 * @swagger
 * /users/update:
 *   post:
 *     summary: Update user details
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("users/update", (req: Request, res: Response) =>
    updateUser(req as RequestWithUser, res)
);

/**
 * @swagger
 * /verifyphone:
 *   post:
 *     summary: Verify user phone number
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyPhoneRequest'
 *     responses:
 *       200:
 *         description: Phone number verified successfully
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/verifyphone", (req: Request, res: Response) =>
    verifyPhone(req as RequestWithUser, res)
);

/**
 * @swagger
 * /logoutall:
 *   get:
 *     summary: Logout all sessions
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: All sessions logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/logoutall", (req: Request, res: Response) =>
    logoutAll(req as RequestWithUser, res)
);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout current session
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current session logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/logout", (req: Request, res: Response) =>
    logout(req as RequestWithUser, res)
);

export default router;
