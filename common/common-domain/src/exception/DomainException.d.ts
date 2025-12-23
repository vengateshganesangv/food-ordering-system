/**
 * Base exception for domain-related errors
 */
export declare class DomainException extends Error {
    readonly cause?: Error;
    constructor(message: string, cause?: Error);
}
