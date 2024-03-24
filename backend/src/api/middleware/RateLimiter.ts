import rateLimit from "express-rate-limit";

export default rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message:
        "Too many requests from this IP, please try again after 15 minutes",
});
