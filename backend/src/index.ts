import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import RequestWithUser from "./types/request";
import { sessionMiddleware } from "./api/middleware/SessionMiddleware";
import UserRoute from "./api/routes/UserRoute";
import yaml from "yamljs";
import swaggerUi from "swagger-ui-express";

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

const swaggerDocument = yaml.load("./src/docs/User.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
    sessionMiddleware(req as RequestWithUser, res, next);
});
app.use(UserRoute);
app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
