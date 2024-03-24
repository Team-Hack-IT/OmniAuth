import { User } from "../src/@types/model.types";
import { compareImages, matchId } from "../src/utils/image";
import { describe, it, expect } from "@jest/globals";

const user: User = {
    address: "123 Main St",
    birthDate: null,
    bucketId: null,
    city: null,
    country: "USA",
    createdAt: null,
    document: null,
    email: "",
    firstname: "John",
    history: null,
    id: "",
    isVerified: null,
    lastname: "Doe",
    password: null,
    phone: null,
    picture: null,
    postalCode: null,
    role: "",
    state: null,
    subject: "",
    updatedAt: "",
};

describe("compareImages", () => {
    it("should return true if the images are similar", async () => {
        const image1 = Buffer.from("image1");
        const image2 = Buffer.from("image1");
        const result = await compareImages(image1, image2);

        expect(result).toBe(true);
    });

    it("should return false if the images are not similar", async () => {
        const image1 = Buffer.from("image1");
        const image2 = Buffer.from("image2");
        const result = await compareImages(image1, image2);

        expect(result).toBe(false);
    });
});

describe("matchId", () => {
    it("should return true if the user's information is found in the image", async () => {
        const file = Buffer.from("image1");
        const result = await matchId(user, file);

        expect(result).toBe(true);
    });

    it("should return false if the user's information is not found in the image", async () => {
        const file = Buffer.from("image2");
        const result = await matchId(user, file);

        expect(result).toBe(false);
    });
});
