"use strict";
/**
 * Outbox Infrastructure Module
 *
 * This module provides the core abstractions for implementing the Outbox pattern
 * in a microservices architecture. The Outbox pattern ensures reliable message
 * publishing by storing messages in a database before publishing them to a message broker.
 *
 * @module @food-ordering-system/outbox
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerConfig = exports.OutboxStatus = void 0;
var OutboxStatus_1 = require("./OutboxStatus");
Object.defineProperty(exports, "OutboxStatus", { enumerable: true, get: function () { return OutboxStatus_1.OutboxStatus; } });
var SchedulerConfig_1 = require("./config/SchedulerConfig");
Object.defineProperty(exports, "SchedulerConfig", { enumerable: true, get: function () { return SchedulerConfig_1.SchedulerConfig; } });
