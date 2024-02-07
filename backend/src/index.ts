import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
const app = express();
const port = process.env.PORT || 3001;
app.use(helmet());
app.use(json({limit: "10mb"}));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(bodyParser.json({ limit: "10mb" }));
const environment = process.env.NODE_ENV;
if(environment === "production"){
  const allowedOrigins = ["http://localhost:5173", ];
  const corsOptions = {
    origin:  (origin:any, callback:any) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
}else{
  app.use(cors());
}

dotenv.config();