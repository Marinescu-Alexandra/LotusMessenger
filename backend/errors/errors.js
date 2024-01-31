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

class ExternalServerError extends AppError {
    constructor(message) {
        super(message, 502);
    }
}

module.exports = { BadRequestError, AppError, ExternalServerError }