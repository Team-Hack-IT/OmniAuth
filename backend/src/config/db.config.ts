import dotenv from "dotenv";

dotenv.config();

const MONGODB_USERNAME: string = process.env.MONGO_USERNAME || "";
const MONGODB_PASSWORD: string = process.env.MONGO_PASSWORD || "";

let MONGODB_URL= process.env.TEST_MONGO_URI!;
if( process.env.NODE_ENV === "production" ){
  MONGODB_URL = process.env.MONGO_URI!;
}

const SERVER_PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3001;

export const dbconfig = {
  mongo: {
    url: MONGODB_URL,
  },
  server: {
    port: SERVER_PORT,
  },
};