import looksSame from "looks-same";
import Tesseract from "tesseract.js";
import { User } from "../@types/model.types";
import { BadRequest } from "./error";

/**
 * Compares two images and determines if they are similar.
 * @param image1 - The first image to compare.
 * @param image2 - The second image to compare.
 * @throws {BadRequest} - If the images do not match.
 */
export async function compareImages(image1: Buffer, image2: Buffer) {
    const isSimilar = await looksSame(image1, image2, {
        tolerance: 5,
        antialiasingTolerance: 0,
        ignoreCaret: true,
    });

    if (!isSimilar) throw new BadRequest("Images do not match");
}

/**
 * Matches the user's information with the text extracted from an image.
 * @param user - The user object containing the information to match.
 * @param file - The image file to extract text from.
 * @throws {BadRequest} - If the user information does not match.
 */
export async function matchId(user: User, file: Buffer) {
    try {
        const {
            data: { text },
        }: { data: { text: string } } = await Tesseract.recognize(file);
        const { firstname, lastname, birthDate, country } = user;

        if (!birthDate || !country || !firstname || !lastname)
            throw new BadRequest();

        if (
            !text.includes(country) &&
            !text.includes(firstname) &&
            !text.includes(lastname) &&
            !text.includes(birthDate)
        ) {
            throw new BadRequest("User information does not match");
        }
    } catch (error) {
        throw error;
    }
}
