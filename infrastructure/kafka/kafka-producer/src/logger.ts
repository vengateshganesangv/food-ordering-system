/**
 * Simple logger implementation
 * In production, this should be replaced with a proper logging library like winston or pino
 */
export class Logger {
  constructor(private context: string) {}

  info(message: string, ...args: any[]): void {
    console.log(`[INFO] [${this.context}] ${message}`, ...args);
  }

  error(message: string, error?: Error | any): void {
    console.error(`[ERROR] [${this.context}] ${message}`, error);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] [${this.context}] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    console.debug(`[DEBUG] [${this.context}] ${message}`, ...args);
  }
}
