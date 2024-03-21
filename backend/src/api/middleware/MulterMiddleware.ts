import multer from "multer";
import * as fileService from "../../utils/file";
import { Request, Response } from "express";
import { BadRequest, NotFound, ServerError } from "../../utils/error";

export default async function uploadFile(
    req: Request & { file: Express.Multer.File },
    res: Response,
    cb: (attachmentId: string, contentType: string) => Promise<void>
) {
    try {
        const upload = multer({
            limits: {
                fileSize: 1024 * 512, // 500kb
            },
        });

        upload.single("file")(req, res, async (err) => {
            const { user } = req;
            const file = req.file?.buffer;
            const contentType = req.file?.mimetype;

            if (err) {
                if (
                    err instanceof multer.MulterError &&
                    err.code === "LIMIT_FILE_SIZE"
                ) {
                    res.status(413).send({ message: "File too large" });
                } else {
                    throw new ServerError();
                }
            }
            if (!user) throw new NotFound("User Not Found");
            if (!file || !contentType) throw new BadRequest();

            const bucketId = user.bucketId
                ? user.bucketId
                : await fileService.createBucket(user);
            const attachmentId = await fileService.upload(
                file,
                bucketId,
                user.role,
                contentType
            );

            await cb(attachmentId, contentType);
            res.status(201).json({ message: "File uploaded successfully" });
        });
    } catch (error) {
        throw error;
    }
}
