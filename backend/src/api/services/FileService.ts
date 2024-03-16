import { Response, Request, NextFunction } from "express";
import { compareImages, matchId } from "../../utils/image";
import * as fileService from "../../utils/file";
import supabase from "../../config/db.config";
import { BadRequest, Conflict, NotFound, ServerError } from "../../utils/error";

const verifyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file?.buffer;
        const sub = req.subject;
        const { type } = req.params;
        const user = req.user;
        const { document, picture } = user;

        if (!file || !type || !sub) throw new BadRequest();
        if (!user || !document || !("idCard" in document) || !picture)
            throw new NotFound();

        const idCard = await fileService.getFile(document.idCard as string);
        const photo = await fileService.getFile(picture as string);

        if (!idCard || !photo) throw new NotFound();

        if (!(await matchId(user, file))) {
            if (user.isVerified) {
                const { error } = await supabase
                    .from("user")
                    .update({ isVerified: false })
                    .eq("id", req.user.id);

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
                    .from("user")
                    .update({ isVerified: true })
                    .eq("id", req.user.id);

                if (error) throw new ServerError();
                res.status(200).json({ verified: true });
            }
        } else {
            res.status(401).json({ verified: false });
        }
    } catch (error) {
        next(error);
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
        throw new BadRequest();
    }

    if (type in user.document) throw new Conflict("File already exists");

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

    if (!saved) throw new ServerError();

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
        throw new NotFound();
    }

    const file = await fileService.getFile(
        type == "picture" ? user.picture : (document[type] as string)
    );

    if (!file) throw new NotFound("File doesn't exist");

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
export { verifyId, uploadFile, downloadFile, replaceFile };
