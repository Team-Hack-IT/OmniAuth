import { v4 as uuidv4 } from "uuid";
import supabase from "../config/db.config";

const getFile = async (attachmentId: string) => {
    const { data, error } = await supabase.storage
        .from(`public/${attachmentId}`)
        .download(attachmentId);

    if (error) {
        return null;
    }

    return data;
};

const createAttachmentId = async (
    contentType: string,
    allowedTypes: string[]
) => {
    const attachmentId = `${uuidv4()}}.${contentType.match(/\/([^/]+)$/)?.[1]}`;

    const { error } = await supabase.storage.createBucket(attachmentId, {
        public: true,
        fileSizeLimit: 1000000,
        allowedMimeTypes: allowedTypes,
    });

    if (error) {
        return null;
    }

    return attachmentId;
};
const uploadFile = async (
    file: any,
    contentType: string,
    allowedTypes: string[]
): Promise<string | null> => {
    const attachmentId = await createAttachmentId(contentType, allowedTypes);

    if (!attachmentId) {
        return null;
    }

    const { error } = await supabase.storage
        .from(attachmentId)
        .upload(`public/${attachmentId}`, file, {
            cacheControl: "3600",
            upsert: false,
        });

    if (error) {
        return null;
    }

    return attachmentId;
};

const saveFile = async (
    user: any,
    table: string,
    sub: string,
    file: any,
    options: {
        contentType: string;
        allowedTypes: string[];
        documentType?: string;
        other?: any;
    }
): Promise<boolean> => {
    const fileId = uploadFile(file, options.contentType, options.allowedTypes);
    let property: any;

    if (!fileId) {
        return false;
    }

    if (options.documentType) {
        user.document[options.documentType] = fileId;
        property = { document: user.document };
    } else {
        user[options.other] = fileId;
        property = { [options.other]: fileId };
    }

    const { error } = await supabase
        .from(table)
        .update(property)
        .eq("subject", sub);

    if (error) {
        return false;
    }

    return true;
};

const deleteFile = async (
    attachmentId: string,
    table: string,
    sub: string,
    user: any,
    type: string
) => {
    const { data, error: storageError } = await supabase.storage
        .from(attachmentId)
        .remove([`public/${attachmentId}`]);

    if (storageError) {
        return false;
    }

    const { error } = await supabase.storage.deleteBucket(attachmentId);

    if (error) {
        return false;
    }

    delete user.document[type];

    const { error: dbError } = await supabase
        .from(table)
        .update({ document: user.document })
        .eq("id", sub);

    if (dbError) {
        return false;
    }
    return true;
};

const updateFile = async (attachmentId: string, file: Buffer) => {
    const { error } = await supabase.storage
        .from(attachmentId)
        .update(`public/${attachmentId}`, file);

    if (error) {
        return false;
    }

    return true;
};
export { saveFile, getFile, deleteFile, updateFile };
