import AllowedFileTypes, * as fileService from "@/utils/file";
import uploadFile from "@/middlewares/MulterMiddleware";
import { Response, Request, NextFunction } from "express";
import { BadRequest, Conflict, NotFound, ServerError } from "@/utils/error";
import { User } from "@/models";

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

        const fileId = parsedDocument[type];
        if (!fileId) throw new NotFound();

        const file = await fileService.download(fileId, bucket_id);

        res.type(fileId.split(".")[1]);
        res.setHeader("Content-disposition", `attachment; filename=${fileId}`);
        res.status(200).send(file);
    } catch (error) {
        next(error);
    }
};

const deleteDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type } = req.params;
        const { user } = req;
        const { id, document, bucket_id, role } = user as User;
        const parsedDocument = document ? JSON.parse(document.toString()) : {};

        if (!type || !bucket_id) throw new BadRequest();
        if (!(type in parsedDocument) || !parsedDocument[type]) {
            throw new NotFound();
        }

        parsedDocument[type] = null;
        await fileService.del(parsedDocument[type], bucket_id, {
            userId: id,
            table: role,
            property: { document: JSON.stringify(parsedDocument) },
        });

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const deletePicture = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { user } = req;
        const { id, picture, bucket_id } = user as User;

        if (!picture || !bucket_id) throw new BadRequest();

        await fileService.del(picture, bucket_id, {
            userId: id,
            table: "user",
            property: { picture: null },
        });

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        next(error);
    }
};
export {
    uploadPicture,
    uploadDocument,
    downloadFile,
    deleteDocument,
    deletePicture,
};
