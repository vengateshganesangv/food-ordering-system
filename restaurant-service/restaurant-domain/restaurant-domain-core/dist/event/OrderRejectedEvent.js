"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRejectedEvent = void 0;
const OrderApprovalEvent_1 = require("./OrderApprovalEvent");
class OrderRejectedEvent extends OrderApprovalEvent_1.OrderApprovalEvent {
    constructor(orderApproval, restaurantId, failureMessages, createdAt) {
        super(orderApproval, restaurantId, failureMessages, createdAt);
    }
}
exports.OrderRejectedEvent = OrderRejectedEvent;
//# sourceMappingURL=OrderRejectedEvent.js.map