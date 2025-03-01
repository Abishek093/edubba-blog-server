export enum HttpStatusCode {
    OK = 200, // Request succeeded
    CREATED = 201, // New resource created
    ACCEPTED = 202, // Request accepted but processing is ongoing
    NO_CONTENT = 204, // Request succeeded, but no content to return
    BAD_REQUEST = 400, // Client-side error (Invalid input)
    UNAUTHORIZED = 401, // User not authenticated
    FORBIDDEN = 403, // User authenticated but not allowed to perform this action
    NOT_FOUND = 404, // Resource not found
    CONFLICT = 409, // Conflict in request (e.g., duplicate data)
    INTERNAL_SERVER = 500 // Server-side error
}

export default HttpStatusCode;
