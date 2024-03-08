import { Response, Request } from "express";
import { BufferObject } from "image-hash";
import User from "../model/User";
import  connectDB  from "../../config/db.config";
import { compareImages, matchId } from "../../utils/image";
import { getFileFromDB, saveFileToDB } from "../../utils/file";

const verifyId = async (req: Request, res: Response) => {
    const file = req.file?.buffer;
    const sub = req.subject;
    const { type } = req.params;
    const user = req.user as User;
    const { document, picture } = user;

    if (!file || !type || !sub) {
        res.status(400).json({ error: "Bad Request" });
        return;
    }

    if (!user || !document || !("idCard" in document) || !picture) {
        res.status(404).json({ error: "Not Found" });
        return;
    }

    connectDB().then(async (store) => {
        const session = store.openSession();
        const idCard = await getFileFromDB(
            session,
            sub,
            document.idCard as string
        );
        const photo = await getFileFromDB(session, sub, picture);

        if (!idCard || !photo) {
            res.status(404).json({ error: "Not Found" });
            return;
        }

        const match = await matchId(user, file);
        if (!match) {
            user.isVerified = false;
            session.store(user, sub);
            session.saveChanges();
            session.dispose();
            res.status(401).json({ verified: false });
            return;
        }

        const idCardBufferObject: BufferObject = { data: idCard };
        const pictureBufferObject: BufferObject = { data: photo };
        const difference = await compareImages(
            idCardBufferObject,
            pictureBufferObject
        );

        if (difference && difference < 5) {
            user.isVerified = true;
            session.store(user, sub);
            session.saveChanges();
            session.dispose();
            res.status(200).json({ verified: true });
        } else {
            session.dispose();
            res.status(401).json({ verified: false });
        }
    });
};

const uploadFile = async (req: Request, res: Response) => {
    const user = req.user as User;
    const sub = req.subject;
    const file = req.file?.buffer;

    if (!file || !user || !sub || req.body.contentType) {
        res.status(400).json({ error: "Bad Request" });
        return;
    }

    connectDB()
        .then(async (store) => {
            const session = store.openSession();
            await saveFileToDB(store, file, sub, req.body.contentType)
                .then((attachmentId) => {
                    user.document = {
                        ...user.document,
                        type: attachmentId,
                    };
                    session.store(user, sub);
                    session.saveChanges();
                    session.dispose();
                    res.status(201).json({ message: "File uploaded" });
                })
                .catch(() => {
                    res.status(422).json({ error: "Unprocessable Entity" });
                });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "An error occurred" });
        });
};

const downloadFile = async (req: Request, res: Response) => {
    try {
        const sub = req.subject;
        const user = req.user as User;
        const { type } = req.params;
        const { document } = user;

        if (!sub || !user || !document || !type) {
            res.status(404).json({ error: "Not Found" });
            return;
        }

        connectDB().then(async (store) => {
            const session = store.openSession();
            const file = await getFileFromDB(
                session,
                sub,
                document[type as keyof typeof document]
            );

            if (file) {
                res.status(200).send(file);
            } else {
                res.status(404).json({ error: "Not Found" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
};

export { verifyId, uploadFile, downloadFile };
