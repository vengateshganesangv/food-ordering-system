"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerConfig = void 0;
const cron = __importStar(require("node-cron"));
/**
 * Configuration for scheduled tasks using node-cron.
 *
 * This class provides a TypeScript abstraction for scheduling periodic tasks,
 * similar to Spring's @EnableScheduling functionality. It uses node-cron to
 * schedule and manage periodic execution of outbox message processing.
 *
 * @example
 * ```typescript
 * const scheduler = new SchedulerConfig();
 * const myScheduler: OutboxScheduler = new MyOutboxScheduler();
 *
 * // Schedule to run every 10 seconds
 * scheduler.scheduleTask('* /10 * * * *', myScheduler);
 *
 * // Or use predefined interval
 * scheduler.scheduleAtFixedRate(myScheduler, 10000); // 10 seconds
 * ```
 */
class SchedulerConfig {
    constructor() {
        this.scheduledTasks = [];
    }
    /**
     * Schedules a task using a cron expression.
     *
     * @param cronExpression - The cron expression defining when to run the task
     *                         Format: second minute hour day month weekday
     *                         Example: '* /10 * * * *' (every 10 seconds)
     * @param scheduler - The outbox scheduler to execute
     * @param options - Optional configuration for the scheduled task
     * @returns The scheduled task instance
     */
    scheduleTask(cronExpression, scheduler, options) {
        const task = cron.schedule(cronExpression, () => {
            try {
                scheduler.processOutboxMessage();
            }
            catch (error) {
                console.error('Error processing outbox messages:', error);
            }
        }, {
            scheduled: true,
            ...options
        });
        this.scheduledTasks.push(task);
        return task;
    }
    /**
     * Schedules a task to run at a fixed rate (in milliseconds).
     *
     * This is a convenience method that converts a millisecond interval
     * into a cron-like scheduled task.
     *
     * @param scheduler - The outbox scheduler to execute
     * @param intervalMs - The interval in milliseconds between executions
     * @returns A timer that can be cleared with clearInterval
     */
    scheduleAtFixedRate(scheduler, intervalMs) {
        const timer = setInterval(() => {
            try {
                scheduler.processOutboxMessage();
            }
            catch (error) {
                console.error('Error processing outbox messages:', error);
            }
        }, intervalMs);
        return timer;
    }
    /**
     * Stops all scheduled tasks managed by this configuration.
     */
    stopAllTasks() {
        this.scheduledTasks.forEach(task => task.stop());
    }
    /**
     * Destroys all scheduled tasks and clears the task list.
     * This should be called when shutting down the application.
     */
    destroy() {
        this.scheduledTasks.forEach(task => task.stop());
        this.scheduledTasks = [];
    }
}
exports.SchedulerConfig = SchedulerConfig;
//# sourceMappingURL=SchedulerConfig.js.map