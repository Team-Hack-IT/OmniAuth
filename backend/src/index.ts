import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import yaml from "yamljs";
import swaggerUi from "swagger-ui-express";
import { sessionMiddleware } from "./api/middleware/SessionMiddleware";
import UserRoute from "./api/routes/UserRoute";
import errorMiddleware from "./api/middleware/ErrorMiddleware";

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
}

const userDocument = yaml.load("./src/docs/User.yaml");
const businessDocument = yaml.load("./src/docs/Business.yaml");
const swaggerDocument = { ...userDocument, ...businessDocument };

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(sessionMiddleware);
app.use(UserRoute);

app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
