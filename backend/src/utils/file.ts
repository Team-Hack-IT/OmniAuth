import supabase from "../config/db.config";
import { v4 as uuidv4 } from "uuid";
import { BadRequest, Conflict, NotFound, ServerError } from "./error";

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
export async function deleteBucket(bucketId: string) {
    const { error } = await supabase.storage.emptyBucket(bucketId);

    if (error) throw new ServerError();

    const { error: StorageError } =
        await supabase.storage.deleteBucket(bucketId);

    if (StorageError) throw new ServerError();
}

/**
 * Creates a new bucket for storing files in Supabase storage.
 * @param userId - The ID of the user.
 * @param table - The name of the table to update.
 * @returns The ID of the created bucket or null if an error occurs.
 */
export async function createBucket(userId: string, table: string) {
    const bucketId = uuidv4();
    const { error: StorageError } = await supabase.storage.createBucket(
        bucketId,
        {
            public: true,
            fileSizeLimit: 1024 * 1024,
            allowedMimeTypes: ["application/pdf", "image/*", "video/mp4"],
        }
    );

    if (StorageError) return null;

    const { error } = await supabase
        .from(table)
        .update({ bucket_id: bucketId })
        .eq("id", userId);

    if (error) return null;

    return bucketId;
}

/**
 * Saves the file ID for a user in a specified table and column.
 * @param userId - The ID of the user.
 * @param table - The name of the table where the user data is stored.
 * @param column - The column where the attachment ID should be saved.
 * @returns True if the attachment ID is saved successfully, false otherwise.
 */
export async function saveFileId(
    userId: string,
    table: string,
    column: object
) {
    const { error } = await supabase
        .from(table)
        .update(column)
        .eq("id", userId);

    if (error) return false;

    return true;
}

/**
 * Downloads a file from Supabase storage.
 *
 * @param attachmentId - The ID of the attachment to download.
 * @param bucketId - The ID of the bucket where the attachment is stored.
 * @returns The downloaded file data.
 * @throws {NotFound} If the file is not found.
 * @throws {ServerError} If there is an error during the download process.
 * @returns A Promise that resolves to the downloaded file as a Buffer.
 */
export async function download(
    attachmentId: string,
    bucketId: string
): Promise<Buffer> {
    const url = supabase.storage.from(bucketId).getPublicUrl(attachmentId);

    return await fetch(url.data.publicUrl)
        .then((res) => res.blob())
        .then(async (blob) => {
            try {
                const buf = await blob.arrayBuffer();
                return Buffer.from(buf);
            } catch {
                throw new ServerError();
            }
        })
        .catch((error) => {
            if (error.message === "Object not found")
                throw new NotFound("File not found");
            throw new ServerError();
        });
}

/**
 * Uploads a file to the specified bucket.
 *
 * @param file - The file to be uploaded as a Buffer.
 * @param bucketId - The ID of the bucket where the file will be uploaded.
 * @param contentType - The content type of the file.
 * @returns A Promise that resolves to the attachment ID of the uploaded file.
 * @throws {Conflict} If the file already exists in the bucket.
 * @throws {ServerError} If an error occurs during the upload process.
 */
export async function upload(
    file: Buffer,
    bucketId: string,
    contentType: string
): Promise<string> {
    const attachmentId = `${uuidv4()}.${contentType.split("/")[1]}`;
    const { error } = await supabase.storage
        .from(bucketId)
        .upload(attachmentId, file, { contentType });

    if (error) {
        if (error.message === "File exits")
            return Promise.reject(new Conflict("File already exists"));
        return Promise.reject(new ServerError());
    }

    return Promise.resolve(attachmentId);
}

/**
 * Deletes a file from the specified bucket.
 * @param attachmentId - The ID of the file to delete.
 * @param bucketId - The ID of the bucket where the file is stored.
 * @throws {NotFound} If the file is not found.
 * @throws {ServerError} If an error occurs while deleting the file.
 */
const deleteAttachmentId = async (attachmentId: string, bucketId: string) => {
    const { error } = await supabase.storage
        .from(bucketId)
        .remove([attachmentId]);

    if (error) {
        if (error.message === "Not found") throw new NotFound("File not found");
        throw new ServerError();
    }
};

export async function del(
    attachmentId: string,
    bucketId: string,
    options: {
        userId: string;
        table: string;
        property: object;
    }
) {
    try {
        if (!bucketId) throw new BadRequest();

        await deleteAttachmentId(attachmentId, bucketId);
        await saveFileId(options.userId, options.table, options.property).then(
            (result) => {
                if (!result) throw new ServerError();
            }
        );
    } catch (error) {
        throw error;
    }
}
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
export async function update(
    file: Buffer,
    attachmentId: string,
    bucketId: string,
    table: string
) {
    const { error } = await supabase.storage
        .from(bucketId)
        .update(`public/${table}/${attachmentId}`, file);

    if (error) {
        if (error.message === "Not found") throw new NotFound("File not found");
        throw new ServerError();
    }
}

export default AllowedFileTypes;
