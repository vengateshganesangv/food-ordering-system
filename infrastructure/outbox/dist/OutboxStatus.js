"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxStatus = void 0;
/**
 * Enum representing the status of an outbox message.
 *
 * The Outbox pattern ensures reliable message publishing by storing messages
 * in a database table (outbox) before publishing them to a message broker.
 * This enum tracks the lifecycle of each outbox message.
 *
 * @enum {string}
 */
var OutboxStatus;
(function (OutboxStatus) {
    /**
     * The outbox message has been created and is ready for processing
     */
    OutboxStatus["STARTED"] = "STARTED";
    /**
     * The outbox message has been successfully published to the message broker
     */
    OutboxStatus["COMPLETED"] = "COMPLETED";
    /**
     * The outbox message failed to be published and may need retry or manual intervention
     */
    OutboxStatus["FAILED"] = "FAILED";
})(OutboxStatus || (exports.OutboxStatus = OutboxStatus = {}));
//# sourceMappingURL=OutboxStatus.js.map