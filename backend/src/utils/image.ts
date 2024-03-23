import looksSame from "looks-same";
import Tesseract from "tesseract.js";
import { User } from "../@types/model.types";

/**
 * Compares two images and determines if they are similar.
 * @param image1 - The first image to compare.
 * @param image2 - The second image to compare.
 * @returns A boolean indicating whether the images are similar.
 */
const compareImages = async (
    image1: Buffer,
    image2: Buffer
): Promise<Boolean> => {
    const isSimilar = await looksSame(image1, image2, {
        tolerance: 5,
        antialiasingTolerance: 0,
        ignoreCaret: true,
    });

    if (isSimilar) return true;

    return false;
};

/**
 * Matches the user's information with the text extracted from an image.
 * @param user - The user object containing the information to match.
 * @param file - The image file to extract text from.
 * @returns A promise that resolves to a boolean indicating whether the user's information matches the extracted text.
 */
const matchId = async (user: User, file: Buffer): Promise<boolean> => {
    try {
        const {
            data: { text },
        }: { data: { text: string } } = await Tesseract.recognize(file);
        const { firstname, lastname, birthDate, country } = user;

        if (!birthDate || !country || !firstname || !lastname) {
            return false;
        }

        if (
            text.includes(country) &&
            text.includes(firstname) &&
            text.includes(lastname) &&
            text.includes(birthDate)
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
