import { Response, Request } from "express";
import { compareImages, matchId } from "../../utils/image";
import * as fileService from "../../utils/file";
import supabase from "../../config/db.config";

const verifyId = async (req: Request, res: Response) => {
    const file = req.file?.buffer;
    const sub = req.subject;
    const { type } = req.params;
    const user = req.user;
    const { document, picture } = user;

    if (!file || !type || !sub) {
        res.status(400).json({ error: "Bad Request" });
        return;
    }

    if (!user || !document || !("idCard" in document) || !picture) {
        res.status(404).json({ error: "Not Found" });
        return;
    }

    const idCard = await fileService.getFile(document.idCard as string);
    const photo = await fileService.getFile(picture as string);

    if (!idCard || !photo) {
        res.status(404).json({ error: "Not Found" });
        return;
    }

    const match = await matchId(user, file);
    if (!match) {
        if (user.isVerified) {
            const { error } = await supabase
                .from("users")
                .update({ isVerified: false })
                .eq("subject", sub);

            if (error) {
                res.status(500).json({ error: "Internal server error" });
                return;
            }
        }
        return;
    }

    const looksSame = await compareImages(idCard, photo);

    if (looksSame) {
        if (!user.isVerified) {
            const { error } = await supabase
                .from("users")
                .update({ isVerified: true })
                .eq("subject", sub);

            if (error) {
                res.status(500).json({ error: "Internal server error" });
                return;
            }
            res.status(200).json({ verified: true });
        }
    } else {
        res.status(401).json({ verified: false });
    }
};

const uploadFile = async (req: Request, res: Response) => {
    const user = req.user;
    const { type } = req.params;
    const file = req.file?.buffer;
    const allowedFiles = ["idCard", "passport", "driverLicense", "picture"];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const contentType = req.file?.mimetype;

    if (
        !file ||
        !user ||
        !contentType ||
        !allowedTypes.includes(contentType) ||
        !type ||
        !allowedFiles.includes(type)
    ) {
        res.status(400).json({ error: "Bad Request" });
        return;
    }

    if (type in user.document) {
        res.status(409).json({ error: "File already exists" });
        return;
    }

    const saved = await fileService.saveFile(
        user,
        user.role,
        req.subject,
        file,
        {
            contentType,
            allowedTypes,
            documentType: type !== "picture" ? type : undefined,
            other: type,
        }
    );

    if (!saved) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

    res.status(201).json({ message: "File uploaded successfully" });
};

const downloadFile = async (req: Request, res: Response) => {
    const sub = req.subject;
    const user = req.user;
    const { type } = req.params;
    const { document } = user;

    if (
        !user ||
        !sub ||
        !document ||
        (!(type in document) && type !== "picture")
    ) {
        res.status(404).json({ error: "Not Found" });
        return;
    }

    const file = await fileService.getFile(
        type == "picture" ? user.picture : (document[type] as string)
    );

    if (!file) {
        res.status(404).json({ error: "Not Found" });
        return;
    }

    res.status(200).send(file);
};

const replaceFile = async (req: Request, res: Response) => {
    const user = req.user;
    const { type } = req.params;
    const file = req.file?.buffer;
    const allowedFiles = ["idCard", "passport", "driverLicense", "picture"];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const contentType = req.file?.mimetype;

    if (
        !file ||
        !user ||
        !contentType ||
        !allowedTypes.includes(contentType) ||
        !type ||
        !allowedFiles.includes(type)
    ) {
        res.status(400).json({ error: "Bad Request" });
        return;
    }

    const updated = await fileService.updateFile(user.document[type], file);

    if (!updated) {
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }

    res.status(200).json({ message: "File updated successfully" });
};
export { verifyId, uploadFile, downloadFile };
