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

const createBucket = async (user: any) => {
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
        .from(user.role)
        .update({ bucketId })
        .eq("id", user.id);

    if (error) throw new ServerError();

    return bucketId;
};

const saveAttachmentId = async (
    user: any,
    attachmentId: string | null,
    property: any
) => {
    const { error } = await supabase
        .from(user.role)
        .update({ [property]: attachmentId })
        .eq("id", user.id);

    if (error) throw new ServerError();
};

const download = async (user: any, attachmentId: string) => {
    const { data, error } = await supabase.storage
        .from(`public/${user.role}/${user.bucketId}`)
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

const del = async (user: any, attachmentId: string) => {
    const { error } = await supabase.storage
        .from(`public/${user.role}/${user.bucketId}`)
        .remove([attachmentId]);

    if (error) {
        if (error.message === "Not found") throw new NotFound("File not found");
        throw new ServerError();
    }
};

const update = async (attachmentId: string, user: any, file: Buffer) => {
    const { error } = await supabase.storage
        .from(user.bucketId)
        .update(`public/${user.role}/${attachmentId}`, file);

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
};
export default AllowedFileTypes;
