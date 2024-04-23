import supabase from "../../config/db.config";
import AllowedFileTypes, * as fileService from "../../utils/file";
import uploadFile from "../middleware/MulterMiddleware";
import { Response, Request, NextFunction } from "express";
import { compareImages, matchId } from "../../utils/image";
import { BadRequest, Conflict, NotFound, ServerError } from "../../utils/error";
import { User } from "../../@types/model.types";

const verifyId = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    try {
        const { type } = req.params;
        const { picture, bucket_id, role, document } = user;

        if (!type || !user || !picture || !bucket_id) throw new BadRequest();

        const parsedDocument = document ? JSON.parse(document.toString()) : {};

        if (!parsedDocument.idCard) throw new NotFound();

        const [idCard, photo] = await Promise.all([
            fileService.download(parsedDocument.idCard, bucket_id, role),
            fileService.download(picture, bucket_id, role),
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
        if (user.is_verified) {
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
        .update({ is_verified: isVerified })
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
            next,
            async (attachmentId: string, contentType: string) => {
                if (!AllowedFileTypes["picture"].includes(contentType))
                    throw new BadRequest();

                await fileService.saveFileId(id, role, {
                    picture: attachmentId,
                });
            }
        );
    } catch (error) {
        next(error);
    }
};

const uploadDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user } = req;
        const { id, document, role } = user as User;
        const parsedDocument = document ? JSON.parse(document.toString()) : {};
        const { type } = req.params;

        if (type === "picture") throw new BadRequest();
        if (parsedDocument[type]) throw new Conflict("File already exists");

        await uploadFile(req, res, next, async (attachmentId: string) => {
            parsedDocument[type] = attachmentId;
            await fileService.saveFileId(id, role, {
                document: JSON.stringify(parsedDocument),
            });
        });
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
        const { document, role, bucket_id, picture } = user as User;
        const parsedDocument = document ? JSON.parse(document.toString()) : {};

        if (!type || !bucket_id) throw new BadRequest();

        const fileId = type === "picture" ? picture : parsedDocument[type];
        console.log(fileId);
        if (!fileId) throw new NotFound();

        const file = await fileService.download(fileId, bucket_id, role);
        if (!file) throw new NotFound("File not found");

        res.setHeader("Content-Type", fileId.split(".")[1]);
        res.setHeader("Content-disposition", `attachment; filename=${fileId}`);
        res.status(200).send(file);
    } catch (error) {
        next(error);
    }
};

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;
        const { user } = req;
        const { id, document, picture, role, bucket_id } = user as User;
        const parsedDocument = document ? JSON.parse(document.toString()) : {};

        if (!type || !bucket_id) throw new BadRequest();

        let attachmentId: string | null = null;
        if (type === "picture") {
            if (!picture) throw new NotFound();
            attachmentId = picture;
            await fileService.del(picture, bucket_id, role);
        } else {
            if (!(type in parsedDocument) || !parsedDocument[type]) {
                throw new NotFound();
            }
            attachmentId = parsedDocument[type];
            await fileService.del(parsedDocument[type], bucket_id, role);
            parsedDocument[type] = null;
        }

        await fileService.saveFileId(id, role, {
            document: JSON.stringify(parsedDocument),
        });

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export { verifyId, uploadPicture, uploadDocument, downloadFile, deleteFile };
