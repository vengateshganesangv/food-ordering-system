"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderApprovedEvent = void 0;
const OrderApprovalEvent_1 = require("./OrderApprovalEvent");
class OrderApprovedEvent extends OrderApprovalEvent_1.OrderApprovalEvent {
    constructor(orderApproval, restaurantId, failureMessages, createdAt) {
        super(orderApproval, restaurantId, failureMessages, createdAt);
    }
}
exports.OrderApprovedEvent = OrderApprovedEvent;
//# sourceMappingURL=OrderApprovedEvent.js.map