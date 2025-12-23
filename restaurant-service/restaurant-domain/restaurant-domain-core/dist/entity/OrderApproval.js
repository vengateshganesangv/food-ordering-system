"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderApproval = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class OrderApproval extends common_domain_1.BaseEntity {
    constructor(orderApprovalId, restaurantId, orderId, approvalStatus) {
        super();
        this.setId(orderApprovalId);
        this.restaurantId = restaurantId;
        this.orderId = orderId;
        this.approvalStatus = approvalStatus;
    }
    static builder() {
        return new OrderApprovalBuilder();
    }
    getRestaurantId() {
        return this.restaurantId;
    }
    getOrderId() {
        return this.orderId;
    }
    getApprovalStatus() {
        return this.approvalStatus;
    }
}
exports.OrderApproval = OrderApproval;
class OrderApprovalBuilder {
    orderApprovalId(val) {
        this._orderApprovalId = val;
        return this;
    }
    restaurantId(val) {
        this._restaurantId = val;
        return this;
    }
    orderId(val) {
        this._orderId = val;
        return this;
    }
    approvalStatus(val) {
        this._approvalStatus = val;
        return this;
    }
    build() {
        if (!this._orderApprovalId || !this._restaurantId || !this._orderId || !this._approvalStatus) {
            throw new Error('Missing required fields for OrderApproval');
        }
        return new OrderApproval(this._orderApprovalId, this._restaurantId, this._orderId, this._approvalStatus);
    }
}
//# sourceMappingURL=OrderApproval.js.map