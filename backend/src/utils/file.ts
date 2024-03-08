import DocumentStore, {
    IDocumentSession,
    PutAttachmentOperation,
} from "ravendb";
import { v4 as uuidv4 } from "uuid";

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
        return Buffer.from(attachmentResult.data.toString());
    } catch (error) {
        console.error("Error fetching attachment:", error);
        return null;
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

export { saveFileToDB, getFileFromDB };
