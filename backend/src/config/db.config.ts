import { DocumentStore } from "ravendb";
import * as fs from "fs";

let store: DocumentStore | null = null;

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

            store.on("afterDispose", () => {
                resolve(store!);
            });
            store.on("error", (err) => {
                store?.dispose();
                store = null;
                reject(err);
            });
        }
    });
}
