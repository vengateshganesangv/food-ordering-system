/**
 * Order Outbox Not Found Exception
 * Thrown when an expected outbox message cannot be found in the database
 */
export declare class OrderOutboxNotFoundException extends Error {
    constructor(message: string);
}
