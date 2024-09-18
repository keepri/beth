export const CODE = "CUSTOM_ERROR";

export enum ERROR_CODE {
    // Client
    BAD_REQUEST = 4000,
    UNAUTHORIZED = 4001,
    FORBIDDEN = 4003,
    NOT_FOUND = 4004,
    METHOD_NOT_ALLOWED = 4005,
    CONFLICT = 4009,
    UNPROCESSABLE_CONTENT = 4022,

    // Server
    INTERNAL = 5000,

    // Custom
    PAGE_NOT_FOUND = 4040,
}
