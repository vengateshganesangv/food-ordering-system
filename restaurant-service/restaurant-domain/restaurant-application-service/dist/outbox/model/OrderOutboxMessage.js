"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxMessageBuilder = exports.OrderOutboxMessage = void 0;
/**
 * Order Outbox Message
 * Represents an outbox message for reliable messaging
 */
var OrderOutboxMessage = /** @class */ (function () {
    function OrderOutboxMessage(id, sagaId, createdAt, processedAt, type, payload, outboxStatus, approvalStatus, version) {
        this.id = id;
        this.sagaId = sagaId;
        this.createdAt = createdAt;
        this.processedAt = processedAt;
        this.type = type;
        this.payload = payload;
        this.outboxStatus = outboxStatus;
        this.approvalStatus = approvalStatus;
        this.version = version;
    }
    OrderOutboxMessage.prototype.getId = function () {
        return this.id;
    };
    OrderOutboxMessage.prototype.getSagaId = function () {
        return this.sagaId;
    };
    OrderOutboxMessage.prototype.getCreatedAt = function () {
        return this.createdAt;
    };
    OrderOutboxMessage.prototype.getProcessedAt = function () {
        return this.processedAt;
    };
    OrderOutboxMessage.prototype.getType = function () {
        return this.type;
    };
    OrderOutboxMessage.prototype.getPayload = function () {
        return this.payload;
    };
    OrderOutboxMessage.prototype.getOutboxStatus = function () {
        return this.outboxStatus;
    };
    OrderOutboxMessage.prototype.getApprovalStatus = function () {
        return this.approvalStatus;
    };
    OrderOutboxMessage.prototype.getVersion = function () {
        return this.version;
    };
    OrderOutboxMessage.prototype.setOutboxStatus = function (status) {
        this.outboxStatus = status;
    };
    OrderOutboxMessage.Builder = /** @class */ (function () {
        function class_1() {
            this._processedAt = null;
            this._version = 0;
        }
        class_1.prototype.id = function (value) {
            this._id = value;
            return this;
        };
        class_1.prototype.sagaId = function (value) {
            this._sagaId = value;
            return this;
        };
        class_1.prototype.createdAt = function (value) {
            this._createdAt = value;
            return this;
        };
        class_1.prototype.processedAt = function (value) {
            this._processedAt = value;
            return this;
        };
        class_1.prototype.type = function (value) {
            this._type = value;
            return this;
        };
        class_1.prototype.payload = function (value) {
            this._payload = value;
            return this;
        };
        class_1.prototype.outboxStatus = function (value) {
            this._outboxStatus = value;
            return this;
        };
        class_1.prototype.approvalStatus = function (value) {
            this._approvalStatus = value;
            return this;
        };
        class_1.prototype.version = function (value) {
            this._version = value;
            return this;
        };
        class_1.prototype.build = function () {
            if (!this._id || !this._sagaId || !this._createdAt || !this._type ||
                !this._payload || !this._outboxStatus || !this._approvalStatus) {
                throw new Error('Missing required fields for OrderOutboxMessage');
            }
            return new OrderOutboxMessage(this._id, this._sagaId, this._createdAt, this._processedAt, this._type, this._payload, this._outboxStatus, this._approvalStatus, this._version);
        };
        return class_1;
    }());
    return OrderOutboxMessage;
}());
exports.OrderOutboxMessage = OrderOutboxMessage;
exports.OrderOutboxMessageBuilder = OrderOutboxMessage.Builder;
