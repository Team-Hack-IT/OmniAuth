import supabase from "../../config/db.config";
import AllowedFileTypes, * as fileService from "../../utils/file";
import uploadFile from "../middleware/MulterMiddleware";
import { Response, Request, NextFunction } from "express";
import { compareImages, matchId } from "../../utils/image";
import { BadRequest, NotFound, ServerError } from "../../utils/error";

const verifyId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sub = req.subject;
        const { type } = req.params;
        const user = req.user;
        const { document, picture } = user;

        if (!type || !sub) throw new BadRequest();
        if (!user || !document || !("idCard" in document) || !picture)
            throw new NotFound();

        const idCard = await fileService.download(user, document.idCard);
        const photo = await fileService.download(user, picture);

        if (!idCard || !photo) throw new NotFound();

        const idCardBuffer = Buffer.from(await idCard.arrayBuffer());

        if (!(await matchId(user, idCardBuffer))) {
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

const uploadPicture = async (
    req: Request & { file: Express.Multer.File },
    res: Response,
    next: NextFunction
) => {
    try {
        await uploadFile(
            req,
            res,
            async (attachmentId: string, contentType: string) => {
                if (!AllowedFileTypes["picture"].includes(contentType))
                    throw new BadRequest();

                await fileService.saveAttachmentId(req.user, attachmentId, {
                    picture: attachmentId,
                });
            }
        );
    } catch (error) {
        next(error);
    }
};

const uploadAttachment = async (
    req: Request & { file: Express.Multer.File },
    res: Response,
    next: NextFunction
) => {
    try {
        const { user } = req;
        const { document } = user;
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

                document[type] = attachmentId;
                await fileService.saveAttachmentId(user, attachmentId, {
                    document,
                });
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
        const user = req.user;
        const { type } = req.params;
        const { document } = user;

        if (!user || !document || (!(type in document) && type !== "picture")) {
            throw new NotFound();
        }

        const file = await fileService.download(
            user,
            type == "picture" ? user.picture : (document[type] as string)
        );

        if (!file) throw new NotFound("File doesn't exist");

        res.status(200).send(file);
    } catch (error) {
        next(error);
    }
};

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const { type } = req.params;
        const { document } = user;

        if (type == "picture") {
            if (!user.picture) throw new NotFound();
            await fileService.del(user, user.picture);
            await fileService.saveAttachmentId(user, null, { picture: null });
        } else {
            if (!(type in document) || !document[type]) throw new NotFound();
            await fileService.del(user, document[type]);
            await fileService.saveAttachmentId(user, null, {
                document: { ...document, [type]: null },
            });
        }

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export { verifyId, uploadPicture, uploadAttachment, downloadFile, deleteFile };
