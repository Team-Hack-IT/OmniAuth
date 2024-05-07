import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import sessionMiddleware from "./api/middleware/SessionMiddleware";
import errorMiddleware from "./api/middleware/ErrorMiddleware";
import rateLimiter from "./api/middleware/RateLimiter";
import BusinessRoute from "./api/routes/BusinessRoute";
import UserRoute from "./api/routes/UserRoute";
import generateDocs from "./utils/generateDocs";
import morganMiddleware from "./api/middleware/MorganMiddleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const environment = process.env.NODE_ENV;

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (environment === "development") {
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(",")
        : ["http://localhost:5173", "http://localhost:3000"];
    const corsOptions = {
        origin: (
            origin: string | undefined,
            callback: (error: Error | null, allow?: boolean) => void
        ) => {
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
    app.use(morganMiddleware);
}

app.use(rateLimiter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(generateDocs()));
app.use(sessionMiddleware);
app.use(UserRoute);
app.use(BusinessRoute);

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: "Not Found" });
});
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
