import supabase from "../config/db.config";
import { v4 as uuidv4 } from "uuid";
import { Conflict, NotFound, ServerError } from "./error";

const AllowedFileTypes = {
    idCard: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
    passport: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
    picture: ["image/png", "image/jpg", "image/jpeg", "image/webp"],
    video: ["video/mp4"],
};

const deleteBucket = async (bucketId: string) => {
    const { error } = await supabase.storage.emptyBucket(bucketId);

    if (error) throw new ServerError();

    const { error: StorageError } =
        await supabase.storage.deleteBucket(bucketId);

    if (StorageError) throw new ServerError();
};

const createBucket = async (userId: string, table: string) => {
    const bucketId = uuidv4();
    const { error: StorageError } = await supabase.storage.createBucket(
        bucketId,
        {
            public: true,
            fileSizeLimit: 100000000,
            allowedMimeTypes: [
                "application/pdf",
                "image/png",
                "image/jpeg",
                "image/jpg",
                "image/webp",
                "video/mp4",
            ],
        }
    );

    if (StorageError) throw new ServerError();

    const { error } = await supabase
        .from(table)
        .update({ bucketId })
        .eq("id", userId);

    if (error) throw new ServerError();

    return bucketId;
};

const saveAttachmentId = async (
    userId: string,
    attachmentId: string | null,
    table: string,
    columnName: string
) => {
    const { error } = await supabase
        .from(table)
        .update({ [columnName]: attachmentId })
        .eq("id", userId);

    if (error) throw new ServerError();
};

const download = async (
    attachmentId: string,
    bucketId: string,
    table: string
) => {
    const { data, error } = await supabase.storage
        .from(`public/${table}/${bucketId}`)
        .download(attachmentId);

    if (error) {
        if (error.message === "Not found") throw new NotFound("File not found");
        throw new ServerError();
    }

    return data;
};

const upload = async (
    file: Buffer,
    bucketId: string,
    table: string,
    contentType: string
) => {
    const attachmentId = `${uuidv4()}}.${contentType.split("/")[1]}`;
    const { error } = await supabase.storage
        .from(bucketId)
        .upload(`public/${table}/${attachmentId}`, file, { contentType });

    if (error) {
        if (error.message === "Not found") throw new NotFound("File not found");
        if (error.message === "File exits") throw new Conflict("File exits");
        throw new ServerError();
    }

    return attachmentId;
};

const del = async (attachmentId: string, bucketId: string, table: string) => {
    const { error } = await supabase.storage
        .from(`public/${table}/${bucketId}`)
        .remove([attachmentId]);

    if (error) {
        if (error.message === "Not found") throw new NotFound("File not found");
        throw new ServerError();
    }
};

const update = async (
    file: Buffer,
    attachmentId: string,
    bucketId: string,
    table: string
) => {
    const { error } = await supabase.storage
        .from(bucketId)
        .update(`public/${table}/${attachmentId}`, file);

    if (error) {
        if (error.message === "Not found") throw new NotFound("File not found");
        throw new ServerError();
    }
};

export {
    createBucket,
    deleteBucket,
    saveAttachmentId,
    download,
    upload,
    del,
    update,
    AllowedFileTypes as default,
};
