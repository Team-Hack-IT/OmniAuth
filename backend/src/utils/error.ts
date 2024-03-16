class Unauthorized extends Error {
    constructor(message: string = "Unauthorized") {
        super(message);
        this.name = "Unauthorized";
    }
}

class Forbidden extends Error {
    constructor(message: string = "Forbidden") {
        super(message);
        this.name = "Forbidden";
    }
}

class ServerError extends Error {
    constructor(message: string = "Internal Server Error") {
        super(message);
        this.name = "ServerError";
    }
}

class NotFound extends Error {
    constructor(message: string = "Not Found") {
        super(message);
        this.name = "NotFound";
    }
}

class BadRequest extends Error {
    constructor(message: string = "Bad Request") {
        super(message);
        this.name = "BadRequest";
    }
}

class Conflict extends Error {
    constructor(message: string = "Conflict") {
        super(message);
        this.name = "Conflict";
    }
}
export { Unauthorized, Forbidden, ServerError, NotFound, BadRequest, Conflict };
