class Unauthorized extends Error {
    constructor(message: string = "Unauthorized") {
        super(message);
        this.name = "Unauthorized";
    }
    statusCode = 401;
}

class Forbidden extends Error {
    constructor(message: string = "Forbidden") {
        super(message);
        this.name = "Forbidden";
    }
    statusCode = 403;
}

class ServerError extends Error {
    constructor(message: string = "Internal Server Error") {
        super(message);
        this.name = "ServerError";
    }
    statusCode = 500;
}

class NotFound extends Error {
    constructor(message: string = "Not Found") {
        super(message);
        this.name = "NotFound";
    }
    statusCode = 404;
}

class BadRequest extends Error {
    constructor(message: string = "Bad Request") {
        super(message);
        this.name = "BadRequest";
    }
    statusCode = 400;
}

class Conflict extends Error {
    constructor(message: string = "Conflict") {
        super(message);
        this.name = "Conflict";
    }
    statusCode = 409;
}
export { Unauthorized, Forbidden, ServerError, NotFound, BadRequest, Conflict };
