import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { sessionMiddleware } from "./api/middleware/ValidateUserSession";
import AuthMiddleware from "./api/middleware/AuthenticateUser";

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (environment === "development") {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : ["http://localhost:5173", "http://localhost:3000"];
    const corsOptions = {
        origin: (origin: string | undefined, callback: any) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    };
    app.use(cors(corsOptions));
} else {
    app.use(cors());
}

app.use(AuthMiddleware);
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});
app.use(sessionMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
