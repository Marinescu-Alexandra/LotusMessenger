class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class BadRequestError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}

class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

class ExternalServerError extends AppError {
    constructor(message) {
        super(message, 502);
    }
}

export { BadRequestError, AppError, ExternalServerError, ConflictError, UnauthorizedError }