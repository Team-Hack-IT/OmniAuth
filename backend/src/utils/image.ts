import { BufferObject, imageHash } from "image-hash";
import sharp from "sharp";
import Tesseract from "tesseract.js";
import User from "../api/model/User";

const hashImage = async (path: BufferObject): Promise<Buffer | null> => {
    await sharp(path.data)
        .resize(16, 16)
        .toBuffer()
        .then((data) => {
            imageHash({ data }, 16, true, (error: any, data: Buffer) => {
                if (error) {
                    console.error(error);
                    return null;
                } else return data;
            });
        })
        .catch((error) => {
            console.error(error);
            return null;
        });
    return null;
};

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

export { hashImage, compareImages, matchId };
