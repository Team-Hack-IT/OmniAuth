import supabase from "../config/db.config";
import { v4 as uuidv4 } from "uuid";
import { Conflict, NotFound, ServerError } from "./error";

const AllowedFileTypes = {
    idCard: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
    passport: ["image/png", "image/jpg", "image/jpeg", "application/pdf"],
    picture: ["image/png", "image/jpg", "image/jpeg", "image/webp"],
    video: ["video/mp4"],
};

/**
 * Deletes a bucket from the storage.
 *
 * @param {string} bucketId - The ID of the bucket to delete.
 * @throws {ServerError} If there is an error while deleting the bucket.
 */
const deleteBucket = async (bucketId: string) => {
    const { error } = await supabase.storage.emptyBucket(bucketId);

    if (error) throw new ServerError();

    const { error: StorageError } =
        await supabase.storage.deleteBucket(bucketId);

    if (StorageError) throw new ServerError();
};

/**
 * Creates a new bucket for storing files in Supabase storage.
 * @param userId - The ID of the user.
 * @param table - The name of the table to update.
 * @returns The ID of the created bucket.
 * @throws {ServerError} If there is an error creating the bucket or updating the table.
 */
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

/**
 * Saves the attachment ID for a user in a specified table and column.
 * @param userId - The ID of the user.
 * @param attachmentId - The ID of the attachment to save. Can be null.
 * @param table - The name of the table where the user data is stored.
 * @param columnName - The name of the column where the attachment ID should be saved.
 * @throws {ServerError} If there is an error while updating the table.
 */
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

/**
 * Downloads a file from Supabase storage.
 *
 * @param attachmentId - The ID of the attachment to download.
 * @param bucketId - The ID of the bucket where the attachment is stored.
 * @param table - The name of the table where the attachment is associated.
 * @returns The downloaded file data.
 * @throws {NotFound} If the file is not found.
 * @throws {ServerError} If there is an error during the download process.
 */
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

/**
 * Uploads a file to the specified bucket and table.
 * @param file - The file to be uploaded as a Buffer.
 * @param bucketId - The ID of the bucket where the file will be uploaded.
 * @param table - The table where the file will be stored.
 * @param contentType - The content type of the file.
 * @returns The attachment ID of the uploaded file.
 * @throws {NotFound} If the file is not found.
 * @throws {Conflict} If the file already exists.
 * @throws {ServerError} If an error occurs during the upload process.
 */
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

/**
 * Deletes a file from the specified bucket and table.
 * @param attachmentId - The ID of the file to delete.
 * @param bucketId - The ID of the bucket where the file is stored.
 * @param table - The name of the table where the file is stored.
 * @throws {NotFound} If the file is not found.
 * @throws {ServerError} If an error occurs while deleting the file.
 */
const del = async (attachmentId: string, bucketId: string, table: string) => {
    const { error } = await supabase.storage
        .from(`public/${table}/${bucketId}`)
        .remove([attachmentId]);

    if (error) {
        if (error.message === "Not found") throw new NotFound("File not found");
        throw new ServerError();
    }
};

/**
 * Updates a file in the specified Supabase storage bucket.
 *
 * @param file - The file to be updated, as a Buffer.
 * @param attachmentId - The ID of the attachment.
 * @param bucketId - The ID of the storage bucket.
 * @param table - The name of the table.
 * @throws {NotFound} If the file is not found.
 * @throws {ServerError} If an error occurs during the update.
 */
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
