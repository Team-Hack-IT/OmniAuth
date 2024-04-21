import supabase from "../../config/db.config";
import AllowedFileTypes, * as fileService from "../../utils/file";
import uploadFile from "../middleware/MulterMiddleware";
import { Response, Request, NextFunction } from "express";
import { compareImages, matchId } from "../../utils/image";
import { BadRequest, NotFound, ServerError } from "../../utils/error";
import { User } from "../../@types/model.types";

const verifyId = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    try {
        const { type } = req.params;
        const { picture, bucketId, role, document } = user;

        if (!type || !user || !picture || !bucketId) throw new BadRequest();

        const parsedDocument = document ? JSON.parse(document.toString()) : {};

        if (!parsedDocument.idCard) throw new NotFound();

        const [idCard, photo] = await Promise.all([
            fileService.download(parsedDocument.idCard, bucketId, role),
            fileService.download(picture, bucketId, role),
        ]);

        if (!idCard || !photo) throw new NotFound();

        const idCardBuffer = Buffer.from(await idCard.arrayBuffer());
        await compareImages(
            idCardBuffer,
            Buffer.from(await photo.arrayBuffer())
        );
        await matchId(user, idCardBuffer);
        res.status(200).json({ verified: true });
    } catch (error) {
        if (user.isVerified) {
            await updateUserVerificationStatus(user.id, false).catch((err) => {
                next(err);
            });
        }
        next(error);
    }
};

const updateUserVerificationStatus = async (
    userId: string,
    isVerified: boolean
) => {
    const { error } = await supabase
        .from("user")
        .update({ isVerified })
        .eq("id", userId);

    if (error) return Promise.reject(new ServerError());
};

const uploadPicture = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id, role } = req.user;

        await uploadFile(
            req,
            res,
            async (attachmentId: string, contentType: string) => {
                if (!AllowedFileTypes["picture"].includes(contentType))
                    throw new BadRequest();

                await fileService.saveAttachmentId(
                    id,
                    attachmentId,
                    role,
                    "picture"
                );
            }
        );
    } catch (error) {
        next(error);
    }
};

const uploadAttachment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user } = req;
        const { id, document, role } = user as User;
        const parsedDocument = document ? JSON.parse(document.toString()) : {};
        const { type } = req.params;

        if (!(type in AllowedFileTypes) || type === "picture") {
            throw new BadRequest();
        }

        await uploadFile(
            req,
            res,
            async (attachmentId: string, contentType: string) => {
                if (
                    !AllowedFileTypes[
                        type as keyof typeof AllowedFileTypes
                    ].includes(contentType)
                ) {
                    throw new BadRequest();
                }

                parsedDocument[type] = attachmentId;
                await fileService.saveAttachmentId(
                    id,
                    attachmentId,
                    role,
                    parsedDocument[type]
                );
                res.status(201).json({ message: "File uploaded successfully" });
            }
        );
    } catch (error) {
        next(error);
    }
};

const downloadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type } = req.params;
        const { user } = req;
        const { document, role, bucketId, picture } = user as User;
        const parsedDocument = document ? JSON.parse(document.toString()) : {};

        if (!type || !bucketId) throw new BadRequest();

        const fileId = type === "picture" ? picture : parsedDocument[type];
        if (!fileId) throw new NotFound();

        const file = await fileService.download(fileId, bucketId, role);
        if (!file) throw new NotFound("File doesn't exist");

        res.status(200).send(file);
    } catch (error) {
        next(error);
    }
};

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;
        const { user } = req;
        const { id, document, picture, role, bucketId } = user as User;
        const parsedDocument = document ? JSON.parse(document.toString()) : {};

        if (!type || !bucketId) throw new BadRequest();

        let attachmentId: string | null = null;
        if (type === "picture") {
            if (!picture) throw new NotFound();
            attachmentId = picture;
            await fileService.del(picture, bucketId, role);
        } else {
            if (!(type in parsedDocument) || !parsedDocument[type]) {
                throw new NotFound();
            }
            attachmentId = parsedDocument[type];
            await fileService.del(parsedDocument[type], bucketId, role);
            parsedDocument[type] = null;
        }

        await fileService.saveAttachmentId(id, attachmentId, role, type);

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export { verifyId, uploadPicture, uploadAttachment, downloadFile, deleteFile };
