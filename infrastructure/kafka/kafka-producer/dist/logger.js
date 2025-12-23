"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
/**
 * Simple logger implementation
 * In production, this should be replaced with a proper logging library like winston or pino
 */
class Logger {
    constructor(context) {
        this.context = context;
    }
    info(message, ...args) {
        console.log(`[INFO] [${this.context}] ${message}`, ...args);
    }
    error(message, error) {
        console.error(`[ERROR] [${this.context}] ${message}`, error);
    }
    warn(message, ...args) {
        console.warn(`[WARN] [${this.context}] ${message}`, ...args);
    }
    debug(message, ...args) {
        console.debug(`[DEBUG] [${this.context}] ${message}`, ...args);
    }
}
exports.Logger = Logger;
