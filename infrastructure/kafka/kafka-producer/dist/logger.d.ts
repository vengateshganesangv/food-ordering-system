/**
 * Simple logger implementation
 * In production, this should be replaced with a proper logging library like winston or pino
 */
export declare class Logger {
    private context;
    constructor(context: string);
    info(message: string, ...args: any[]): void;
    error(message: string, error?: Error | any): void;
    warn(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
}
