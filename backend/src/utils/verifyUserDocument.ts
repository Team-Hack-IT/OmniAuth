import supabase from "@/config/db.config";
import { BadRequest, NotFound, ServerError } from "./error";
import { download } from "./file";
import { User } from "@/models";
import { compareImages, matchId } from "./image";

export async function verifyId(user: User, type: string) {
    if (!(type in ["passport", "driveLiscense", "idCard"])) {
        throw new BadRequest();
    }
    const { picture, bucket_id, document } = user;

    if (!type || !user || !picture || !bucket_id) throw new BadRequest();

    const parsedDocument = document ? JSON.parse(document.toString()) : {};

    if (!parsedDocument.type) throw new NotFound();

    const [idCard, photo] = await Promise.all([
        download(parsedDocument.type, bucket_id),
        download(picture, bucket_id),
    ]);

    if (!idCard || !photo) throw new NotFound();

    await compareImages(idCard, photo);
    await matchId(user, idCard);
}

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
