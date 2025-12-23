import * as cron from 'node-cron';
import { OutboxScheduler } from '../OutboxScheduler';
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
export declare class SchedulerConfig {
    private scheduledTasks;
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
    scheduleTask(cronExpression: string, scheduler: OutboxScheduler, options?: cron.ScheduleOptions): cron.ScheduledTask;
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
    scheduleAtFixedRate(scheduler: OutboxScheduler, intervalMs: number): NodeJS.Timeout;
    /**
     * Stops all scheduled tasks managed by this configuration.
     */
    stopAllTasks(): void;
    /**
     * Destroys all scheduled tasks and clears the task list.
     * This should be called when shutting down the application.
     */
    destroy(): void;
}
