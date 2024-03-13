import sharp from "sharp";
import looksSame from "looks-same";
import Tesseract from "tesseract.js";

const compareImages = async (image1: any, image2: any) => {
    const isSimilar = await looksSame(image1, image2, {
        tolerance: 5,
        antialiasingTolerance: 0,
        ignoreCaret: true,
    });

    if (isSimilar) {
        return true;
    }
};

const matchId = async (user: any, file: Buffer): Promise<Boolean> => {
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

export { compareImages, matchId };
