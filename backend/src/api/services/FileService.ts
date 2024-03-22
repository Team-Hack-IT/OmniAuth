import supabase from "../../config/db.config";
import AllowedFileTypes, * as fileService from "../../utils/file";
import uploadFile from "../middleware/MulterMiddleware";
import { Response, Request, NextFunction } from "express";
import { compareImages, matchId } from "../../utils/image";
import { BadRequest, NotFound, ServerError } from "../../utils/error";
import { User } from "../../@types/model.types";

const verifyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sub = req.subject;
        const user = req.user as User;
        const { type } = req.params;
        const { picture, bucketId, role } = user;
        const document = user.document
            ? JSON.parse(user.document.toString())
            : {};

        if (!type || !sub) throw new BadRequest();
        if (!document || !("idCard" in document) || !picture || !bucketId)
            throw new NotFound();

        const idCard = await fileService.download(
            document.idCard,
            bucketId,
            role
        );
        const photo = await fileService.download(picture, bucketId, role);

        if (!idCard || !photo) throw new NotFound();

        const idCardBuffer = Buffer.from(await idCard.arrayBuffer());
        const photoBuffer = Buffer.from(await photo.arrayBuffer());

        if (!(await matchId(user, idCardBuffer))) {
            if (user.isVerified) {
                const { error } = await supabase
                    .from("user")
                    .update({ isVerified: false })
                    .eq("id", req.user.id);

                if (error) throw new ServerError();
            }
            return;
        }

        if (await compareImages(idCardBuffer, photoBuffer)) {
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

        if (!(type in AllowedFileTypes) || type == "picture")
            throw new BadRequest();

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
        if (type == "picture" && !picture) throw new NotFound();
        if (!(type in parsedDocument) || !parsedDocument[type])
            throw new NotFound();

        const file = await fileService.download(
            type == "picture" ? picture : parsedDocument[type],
            bucketId,
            role
        );

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

        if (type == "picture") {
            if (!picture) throw new NotFound();
            await fileService.del(picture, bucketId, role);
            await fileService.saveAttachmentId(id, null, role, "picture");
        } else {
            if (!(type in parsedDocument) || !parsedDocument[type])
                throw new NotFound();
            await fileService.del(parsedDocument[type], bucketId, role);
            parsedDocument[type] = null;
            await fileService.saveAttachmentId(
                id,
                null,
                role,
                parsedDocument[type]
            );
        }

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export { verifyId, uploadPicture, uploadAttachment, downloadFile, deleteFile };
