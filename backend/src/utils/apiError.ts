
/*
Custom error type for API responses with HTTP status and optional details

- Extends Error
- Includes statusCode (number)
- Optional details of unknown type
- Sets prototype and captures stack trace in constructor

*/

export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly details?: unknown;

    constructor(statusCode: number, message: string, details?: unknown) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
        this.details = details;

        Object.setPrototypeOf(this, ApiError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}