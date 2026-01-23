export class ApplicationError extends Error {
    public code: string;
    public statusCode: number;
    public details?: Record<string, any>;

    constructor(
        message: string,
        code: string = 'INTERNAL_ERROR',
        statusCode: number = 500,
        details?: Record<string, any>
    ) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;

        // Ensure strict type checking in non-V8 environments if needed, 
        // though React apps usually target browsers where this standardizes well.
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class ValidationError extends ApplicationError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, 'VALIDATION_ERROR', 400, details);
    }
}

export class NotFoundError extends ApplicationError {
    constructor(message: string = 'Resource not found', details?: Record<string, any>) {
        super(message, 'NOT_FOUND', 404, details);
    }
}

export class AuthenticationError extends ApplicationError {
    constructor(message: string = 'Authentication required', details?: Record<string, any>) {
        super(message, 'UNAUTHORIZED', 401, details);
    }
}

export class APIError extends ApplicationError {
    constructor(message: string, statusCode: number = 500, details?: Record<string, any>) {
        super(message, 'API_ERROR', statusCode, details);
    }
}
