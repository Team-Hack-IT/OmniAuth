import morgan from "morgan";
import logger from "../../config/logger";

const morganMiddleware = morgan(
    (tokens, req, res) => {
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: tokens.status(req, res),
            "response-time": tokens["response-time"](req, res) + " ms",
            "remote-address": tokens["remote-addr"](req, res),
            "remote-user": tokens["remote-user"](req, res),
            "user-agent": tokens["user-agent"](req, res),
            "http-version": tokens["http-version"](req, res),
            referrer: tokens.referrer(req, res),
        });
    },
    {
        stream: {
            write: (message) => {
                const data = JSON.parse(message);
                logger.http("incoming request", data);
            },
        },
    }
);

export default morganMiddleware;
