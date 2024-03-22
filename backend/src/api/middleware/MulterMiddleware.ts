import multer from "multer";
import NodeClam from "clamscan";
import * as fileService from "../../utils/file";
import { Request, Response } from "express";
import { BadRequest, NotFound, ServerError } from "../../utils/error";

const upload = multer({
    limits: {
        fileSize: 1024 * 196, // 200kb
    },
});

const clamscan = new NodeClam().init({
    removeInfected: true,
    quarantineInfected: "~/infected/",
    scanLog: "../logs/node-clam",
    debugMode: true,
});

const handleMulterError = (err: multer.MulterError, res: Response) => {
    switch (err.code) {
        case "LIMIT_FILE_SIZE":
            res.status(413).send({ error: "File too large" });
            break;
        case "LIMIT_UNEXPECTED_FILE":
            res.status(400).send({ error: "Unexpected field" });
            break;
        default:
            throw new ServerError();
    }
};

export default async function uploadFile(
    req: Request,
    res: Response,
    cb: (attachmentId: string, contentType: string) => Promise<void>
) {
    try {
        upload.single("file")(req, res, async (err) => {
            if (err) {
                handleMulterError(err, res);
                return;
            }
            if (!req.file) throw new BadRequest("No file uploaded");

            const { user } = req;
            const contentType = req.file.mimetype;
            const file = req.file.buffer;

            (await clamscan)
                .scanFile(req.file.path)
                .then(({ file, isInfected }) => {
                    if (isInfected) throw new BadRequest();
                });

            const bucketId = user.bucketId
                ? user.bucketId
                : await fileService.createBucket(user.id, user.role);
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
