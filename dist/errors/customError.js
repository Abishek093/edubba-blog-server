"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    statusCode;
    status;
    isOperational;
    details;
    constructor(error, statusCode, details) {
        let message;
        if (error instanceof Error) {
            message = error.message;
        }
        else if (error && typeof error === 'object' && 'message' in error) {
            message = String(error.message);
        }
        else if (typeof error === 'string') {
            message = error;
        }
        else {
            message = "Oops, something went wrong!";
        }
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.isOperational = true;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            status: this.status,
            error: this.message,
            ...(this.details && { details: this.details }),
            ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
        };
    }
}
exports.default = CustomError;
