import { RequestHandler, Response, Request } from "express";
import { v4 as uuidv4 } from "uuid";
import Tesseract from "tesseract.js";
import { connectDB } from "../config/db.config";
import { BufferObject, imageHash } from "image-hash";
import sharp from "sharp";
import User from "../api/model/User";
import RequestWithUser from "../types/request";
import {
    DocumentStore,
    PutAttachmentOperation,
    IDocumentSession,
} from "ravendb";

const compareImages = async (image1: BufferObject, image2: BufferObject) => {
    try {
        const hash1 = await hashImage(image1);
        const hash2 = await hashImage(image1);

        if (!hash1 || !hash2) {
            console.error("Error hashing images");
            return -1;
        }
        let difference = 0;

        for (let i = 0; i < hash1.length; i++) {
            if (hash1[i] !== hash2[i]) difference++;
        }
        return difference;
    } catch (error) {
        console.error("Error comparing images:", error);
    }
};
const hashImage = async (path: BufferObject): Promise<Buffer | null> => {
    imageHash(path, 16, true, (error: any, data: Buffer) => {
        if (error) {
            console.error(error);
            return null;
        } else return data;
    });
    return null;
};

const verifyId = async (req: RequestWithUser, res: Response) => {
    const file = req.file?.buffer;
    const { type } = req.params;

    if (!file || !req.user || !req.user.document) {
        res.status(400).json({ error: "Bad Request" });
        return;
    }

    connectDB().then(async (store) => {
        const session = store.openSession();
        const user = await session.load<User>(req.subject);
        const idCard = await getFileFromDB(
            session,
            req.subject,
            (req.user?.document as { identityCard: string }).identityCard
        );
        const picture = await getFileFromDB(
            session,
            req.subject,
            (req.user?.document as { picture: string }).picture
        );

        if (user && idCard && picture) {
            const match = await matchId(user, file);
            if (!match) {
                res.status(401).json({ verified: false });
                return;
            }

            const idCardBuffer = await sharp(idCard).toBuffer();
            const pictureBuffer = await sharp(picture).toBuffer();
            const difference = 0; //await compareImages(idCardBuffer, pictureBuffer);

            if (difference && difference < 200) {
                user.isVerified = true;
                session.saveChanges();
                res.status(200).json({ verified: true });
            } else {
                res.status(401).json({ verified: false });
                return;
            }
        } else {
            res.status(404).json({ error: "Not Found" });
        }
    });
};

const matchId = async (user: User, file: Buffer): Promise<Boolean> => {
    try {
        const {
            data: { text },
        }: { data: { text: string } } = await Tesseract.recognize(file);

        if (
            user.country &&
            text.includes(user.country) &&
            text.includes(user.firstname) &&
            text.includes(user.lastname)
        ) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
};

const saveFileToDB = async (
    store: DocumentStore,
    fileBuffer: Buffer,
    documentId: string,
    contentType: string
): Promise<string> => {
    const attachmentId = `${uuidv4()}}.${contentType.match(/\/([^/]+)$/)?.[1]}`;

    try {
        await store.operations.send(
            new PutAttachmentOperation(
                documentId,
                attachmentId,
                fileBuffer,
                contentType
            )
        );
        return Promise.resolve(attachmentId);
    } catch (error) {
        console.error(error);
    } finally {
        store.dispose();
    }
    return Promise.reject();
};

const getFileFromDB = async (
    session: IDocumentSession,
    documentId: string,
    attachmentId: string
): Promise<Buffer | null> => {
    try {
        const attachmentResult = await session.advanced.attachments.get(
            documentId,
            attachmentId
        );

        if (!attachmentResult) {
            console.error(
                `Attachment ${attachmentId} not found for document ${documentId}`
            );
            return null;
        }
        //const attachmentBuffer = Buffer.from(attachmentResult.data);
        //return attachmentBuffer;
        return null;
    } catch (error) {
        console.error("Error fetching attachment:", error);
        return null;
    }
};

const uploadFile = async (req: RequestWithUser, res: Response) => {
    try {
        const file = req.file?.buffer;

        if (!file || !req.user || !req.user.country || req.body.contentType) {
            res.status(400).json({ error: "Bad Request" });
            return;
        }

        connectDB().then(async (store) => {
            const session = store.openSession();
            const user = await session.load<User>(req.subject);

            if (user) {
                await saveFileToDB(
                    store,
                    file,
                    req.subject,
                    req.body.contentType
                )
                    .then((attachmentId) => {
                        const { type } = req.params;

                        user.document = {
                            ...user.document,
                            type: attachmentId,
                        };

                        session.saveChanges();
                        res.status(201).json({ message: "File uploaded" });
                    })
                    .catch(() => {
                        res.status(422).json({ error: "Unprocessable Entity" });
                    });
            } else {
                res.status(404).json({ error: "Not Found" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
};

const downloadFile = async (req: RequestWithUser, res: Response) => {
    try {
        const { document } = req.user;
        const { type } = req.params;
        if (!req.user || !document || !(type in document)) {
            res.status(404).json({ error: "Not Found" });
            return;
        }

        connectDB().then(async (store) => {
            const session = store.openSession();
            const user = await session.load<User>(req.subject);

            if (user) {
                const file = await getFileFromDB(
                    session,
                    req.subject,
                    (req.user?.document as { type: string }).type
                );

                if (file) {
                    res.status(200).send(file);
                } else {
                    res.status(404).json({ error: "Not Found" });
                }
            } else {
                res.status(404).json({ error: "Not Found" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
};
export { uploadFile, downloadFile, verifyId };
