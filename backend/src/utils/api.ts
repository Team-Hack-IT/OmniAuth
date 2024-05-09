import crypto from "crypto";

export function generateAPIKey(size: number = 128) {
    return crypto.randomBytes(size, (err, buf) => {
        if (err) {
            throw new Error(err.message);
        }
        return buf.toString("hex");
    });
}

export function limitRate() {}
