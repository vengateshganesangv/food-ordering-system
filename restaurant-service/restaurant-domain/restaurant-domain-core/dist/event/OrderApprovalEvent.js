"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderApprovalEvent = void 0;
class OrderApprovalEvent {
    constructor(orderApproval, restaurantId, failureMessages, createdAt) {
        this.orderApproval = orderApproval;
        this.restaurantId = restaurantId;
        this.failureMessages = failureMessages;
        this.createdAt = createdAt;
    }
    getOrderApproval() {
        return this.orderApproval;
    }
    getRestaurantId() {
        return this.restaurantId;
    }
    getFailureMessages() {
        return this.failureMessages;
    }
    getCreatedAt() {
        return this.createdAt;
    }
}
exports.OrderApprovalEvent = OrderApprovalEvent;
//# sourceMappingURL=OrderApprovalEvent.js.map