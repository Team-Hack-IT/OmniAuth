import { DocumentStore } from "ravendb";
import * as fs from "fs";
import dotenv from "dotenv";

dotenv.config();

let store: DocumentStore | null = null;

/**
 * Connects to the database and returns a Promise that resolves to a DocumentStore instance.
 * If a DocumentStore instance already exists, it will be returned without creating a new one.
 * @returns A Promise that resolves to a DocumentStore instance.
 */
export async function connectDB(): Promise<DocumentStore> {
    return new Promise((resolve, reject) => {
        if (store) {
            resolve(store);
            return;
        } else {
            store = new DocumentStore(
                process.env.DB_URL || "",
                process.env.DB_NAME || "Omni"
            );
            const cert = fs.readFileSync(process.env.CERT_PATH || "");

            store.authOptions = {
                certificate: cert,
                type: "pfx",
            };
            store.initialize();

            store.on("error", (err) => {
                store?.dispose();
                store = null;
                reject(err);
            });

            console.log("Connected to Database");
            resolve(store!);
        }
    });
}
