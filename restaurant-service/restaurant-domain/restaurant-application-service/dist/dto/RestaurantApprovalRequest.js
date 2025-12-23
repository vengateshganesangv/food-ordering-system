"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantApprovalRequestBuilder = void 0;
/**
 * Builder for RestaurantApprovalRequest
 */
var RestaurantApprovalRequestBuilder = /** @class */ (function () {
    function RestaurantApprovalRequestBuilder() {
    }
    RestaurantApprovalRequestBuilder.prototype.id = function (value) {
        this._id = value;
        return this;
    };
    RestaurantApprovalRequestBuilder.prototype.sagaId = function (value) {
        this._sagaId = value;
        return this;
    };
    RestaurantApprovalRequestBuilder.prototype.restaurantId = function (value) {
        this._restaurantId = value;
        return this;
    };
    RestaurantApprovalRequestBuilder.prototype.orderId = function (value) {
        this._orderId = value;
        return this;
    };
    RestaurantApprovalRequestBuilder.prototype.restaurantOrderStatus = function (value) {
        this._restaurantOrderStatus = value;
        return this;
    };
    RestaurantApprovalRequestBuilder.prototype.products = function (value) {
        this._products = value;
        return this;
    };
    RestaurantApprovalRequestBuilder.prototype.price = function (value) {
        this._price = value;
        return this;
    };
    RestaurantApprovalRequestBuilder.prototype.createdAt = function (value) {
        this._createdAt = value;
        return this;
    };
    RestaurantApprovalRequestBuilder.prototype.build = function () {
        if (!this._id || !this._sagaId || !this._restaurantId || !this._orderId ||
            !this._restaurantOrderStatus || !this._products || this._price === undefined || !this._createdAt) {
            throw new Error('Missing required fields for RestaurantApprovalRequest');
        }
        return {
            id: this._id,
            sagaId: this._sagaId,
            restaurantId: this._restaurantId,
            orderId: this._orderId,
            restaurantOrderStatus: this._restaurantOrderStatus,
            products: this._products,
            price: this._price,
            createdAt: this._createdAt,
        };
    };
    return RestaurantApprovalRequestBuilder;
}());
exports.RestaurantApprovalRequestBuilder = RestaurantApprovalRequestBuilder;
