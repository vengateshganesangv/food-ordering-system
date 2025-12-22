"use strict";
/**
 * SAGA Infrastructure Module
 *
 * This module provides the core abstractions for implementing the SAGA pattern
 * in a distributed transaction context. The SAGA pattern ensures data consistency
 * across microservices by coordinating a sequence of local transactions.
 *
 * @module @food-ordering-system/saga
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_SAGA_NAME = exports.SagaStatus = void 0;
var SagaStatus_1 = require("./SagaStatus");
Object.defineProperty(exports, "SagaStatus", { enumerable: true, get: function () { return SagaStatus_1.SagaStatus; } });
var SagaConstants_1 = require("./order/SagaConstants");
Object.defineProperty(exports, "ORDER_SAGA_NAME", { enumerable: true, get: function () { return SagaConstants_1.ORDER_SAGA_NAME; } });
//# sourceMappingURL=index.js.map