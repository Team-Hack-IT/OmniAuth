import multer from "multer";
import NodeClam from "clamscan";
import AllowedFileTypes, * as fileService from "../../utils/file";
import { Request, Response } from "express";
import { Conflict } from "../../utils/error";

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
    cb: (attachmentId: string, contentType: string) => Promise<void>
) {
    try {
        upload.single("file")(req, res, async (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ error: err.message });
                }
                return res.status(500).json({ error: "Internal Server Error" });
            }

            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            if (await scanFIle(req.file.path)) {
                return res.status(400).json({ error: "File is infected" });
            }

            const { user } = req;
            const { type } = req.params;
            let { role, bucket_id } = user;
            const contentType = req.file.mimetype;
            const file = req.file.buffer;

            if (
                type &&
                (!(type in AllowedFileTypes) ||
                    !AllowedFileTypes[
                        type as keyof typeof AllowedFileTypes
                    ].includes(contentType))
            ) {
                return res.status(400).json({ error: "Invalid file type" });
            }

            if (!bucket_id) {
                bucket_id = await fileService.createBucket(user.id, user.role);
                if (!bucket_id)
                    return res
                        .status(500)
                        .json({ error: "Internal Server Error" });
            }
            await fileService
                .upload(file, bucket_id, contentType)
                .then(async (attachmentId) => {
                    await cb(attachmentId, contentType);
                    res.status(200).json({
                        message: "File uploaded successfully",
                    });
                })
                .catch((err) => {
                    res.status(err.statusCode).json({ error: err.message });
                });
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
