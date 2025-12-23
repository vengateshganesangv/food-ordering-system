"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEventPayloadBuilder = void 0;
/**
 * Builder for OrderEventPayload
 */
var OrderEventPayloadBuilder = /** @class */ (function () {
    function OrderEventPayloadBuilder() {
        this._failureMessages = [];
    }
    OrderEventPayloadBuilder.prototype.orderId = function (value) {
        this._orderId = value;
        return this;
    };
    OrderEventPayloadBuilder.prototype.restaurantId = function (value) {
        this._restaurantId = value;
        return this;
    };
    OrderEventPayloadBuilder.prototype.createdAt = function (value) {
        this._createdAt = value;
        return this;
    };
    OrderEventPayloadBuilder.prototype.orderApprovalStatus = function (value) {
        this._orderApprovalStatus = value;
        return this;
    };
    OrderEventPayloadBuilder.prototype.failureMessages = function (value) {
        this._failureMessages = value;
        return this;
    };
    OrderEventPayloadBuilder.prototype.build = function () {
        if (!this._orderId || !this._restaurantId || !this._createdAt || !this._orderApprovalStatus) {
            throw new Error('Missing required fields for OrderEventPayload');
        }
        return {
            orderId: this._orderId,
            restaurantId: this._restaurantId,
            createdAt: this._createdAt,
            orderApprovalStatus: this._orderApprovalStatus,
            failureMessages: this._failureMessages,
        };
    };
    return OrderEventPayloadBuilder;
}());
exports.OrderEventPayloadBuilder = OrderEventPayloadBuilder;
