import multer from "multer";
import NodeClam from "clamscan";
import AllowedFileTypes, * as fileService from "../../utils/file";
import { Request, Response } from "express";
import { NextFunction } from "express-serve-static-core";
import { BadRequest, ServerError } from "../../utils/error";

const upload = multer({
    limits: {
        fileSize: 1024 * 196, // 200kb
    },
});

const scanFIle = async (path: string): Promise<Boolean> => {
    const options = {
        removeInfected: true,
        scanLog: "../logs/node-clam",
        debugMode: true,
        clamdscan: {
            socket: "/var/run/clamav/clamd.sock",
            host: "",
            timeout: 20000,
        },
        preference: "clamdscan",
    };

    if (process.env.CLAMSTATUS == "ready") {
        (await new NodeClam().init(options))
            .scanFile(path)
            .then(({ file, isInfected }) => {
                if (isInfected) return true;
                return false;
            })
            .catch(() => {
                return true;
            });
    }

    return false;
};

export default async function uploadFile(
    req: Request,
    res: Response,
    next: NextFunction,
    cb: (attachmentId: string, contentType: string) => Promise<void>
) {
    const { type } = req.params;

    if (!type || !(type in AllowedFileTypes)) {
        return next(new BadRequest());
    }

    upload.single("file")(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return next(new BadRequest(err.message));
        }
        if (!req.file) {
            return next(new BadRequest("No file uploaded"));
        }
        if (await scanFIle(req.file.path)) {
            return next(new BadRequest("Infected file"));
        }

        const { user } = req;
        let { id, role, bucket_id } = user;
        const contentType = req.file.mimetype;
        const file = req.file.buffer;

        if (
            !AllowedFileTypes[type as keyof typeof AllowedFileTypes].includes(
                contentType
            )
        ) {
            return next(new BadRequest());
        }
        if (!bucket_id) {
            bucket_id = await fileService.createBucket(id, role);
            if (!bucket_id) return next(new ServerError());
        }
        await fileService
            .upload(file, bucket_id, contentType)
            .then(async (attachmentId) => {
                await cb(attachmentId, contentType);
            });
        return res.status(200).json({ message: "File uploaded" });
    });
}
