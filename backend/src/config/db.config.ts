import { DocumentStore } from "ravendb";
import * as fs from "fs";

export async function connectDB(
    certPath: string,
    dbUrl: string,
    dbName: string = "Omni"
): Promise<DocumentStore> {
    const store = new DocumentStore(dbUrl, dbName);
    const cert = fs.readFileSync(certPath);

    store.authOptions = {
        certificate: cert,
        type: "pfx",
    };
    store.initialize();

    try {
        store.openSession();
        console.log("Connected to Database");
        return store;
    } catch (error) {
        console.error("Error connecting to Database:", error);
        throw error;
    }
}
