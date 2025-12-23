"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantDomainServiceImpl = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const OrderApprovedEvent_1 = require("./event/OrderApprovedEvent");
const OrderRejectedEvent_1 = require("./event/OrderRejectedEvent");
class RestaurantDomainServiceImpl {
    validateOrder(restaurant, failureMessages) {
        restaurant.validateOrder(failureMessages);
        console.log(`Validating order with id: ${restaurant.getOrderDetail().getId()?.getValue()}`);
        if (failureMessages.length === 0) {
            console.log(`Order is approved for order id: ${restaurant.getOrderDetail().getId()?.getValue()}`);
            restaurant.constructOrderApproval(common_domain_1.OrderApprovalStatus.APPROVED);
            return new OrderApprovedEvent_1.OrderApprovedEvent(restaurant.getOrderApproval(), restaurant.getId(), failureMessages, new Date());
        }
        else {
            console.log(`Order is rejected for order id: ${restaurant.getOrderDetail().getId()?.getValue()}`);
            restaurant.constructOrderApproval(common_domain_1.OrderApprovalStatus.REJECTED);
            return new OrderRejectedEvent_1.OrderRejectedEvent(restaurant.getOrderApproval(), restaurant.getId(), failureMessages, new Date());
        }
    }
}
exports.RestaurantDomainServiceImpl = RestaurantDomainServiceImpl;
//# sourceMappingURL=RestaurantDomainServiceImpl.js.map