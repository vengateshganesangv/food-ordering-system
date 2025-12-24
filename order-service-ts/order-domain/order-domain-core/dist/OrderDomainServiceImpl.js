"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDomainServiceImpl = void 0;
const OrderCreatedEvent_1 = require("./event/OrderCreatedEvent");
const OrderPaidEvent_1 = require("./event/OrderPaidEvent");
const OrderCancelledEvent_1 = require("./event/OrderCancelledEvent");
const OrderDomainException_1 = require("./exception/OrderDomainException");
/**
 * Order Domain Service Implementation
 * Implements core business logic for orders
 */
class OrderDomainServiceImpl {
    validateAndInitiateOrder(order, restaurant) {
        this.validateRestaurant(restaurant);
        this.setOrderProductInformation(order, restaurant);
        order.validateOrder();
        order.initializeOrder();
        OrderDomainServiceImpl.logger.info(`Order with id: ${order.getId()?.getValue()} is initiated`);
        return new OrderCreatedEvent_1.OrderCreatedEvent(order, new Date());
    }
    payOrder(order) {
        order.pay();
        OrderDomainServiceImpl.logger.info(`Order with id: ${order.getId()?.getValue()} is paid`);
        return new OrderPaidEvent_1.OrderPaidEvent(order, new Date());
    }
    approveOrder(order) {
        order.approve();
        OrderDomainServiceImpl.logger.info(`Order with id: ${order.getId()?.getValue()} is approved`);
    }
    cancelOrderPayment(order, failureMessages) {
        order.initCancel(failureMessages);
        OrderDomainServiceImpl.logger.info(`Order payment is cancelling for order id: ${order.getId()?.getValue()}`);
        return new OrderCancelledEvent_1.OrderCancelledEvent(order, new Date());
    }
    cancelOrder(order, failureMessages) {
        order.cancel(failureMessages);
        OrderDomainServiceImpl.logger.info(`Order with id: ${order.getId()?.getValue()} is cancelled`);
    }
    validateRestaurant(restaurant) {
        if (!restaurant.isActive()) {
            throw new OrderDomainException_1.OrderDomainException(`Restaurant with id ${restaurant.getId()?.getValue()} is currently not active!`);
        }
    }
    setOrderProductInformation(order, restaurant) {
        order.getItems().forEach((orderItem) => {
            restaurant.getProducts().forEach((restaurantProduct) => {
                const currentProduct = orderItem.getProduct();
                if (currentProduct.equals(restaurantProduct)) {
                    const name = restaurantProduct.getName();
                    const price = restaurantProduct.getPrice();
                    if (name && price) {
                        currentProduct.updateWithConfirmedNameAndPrice(name, price);
                    }
                }
            });
        });
    }
}
exports.OrderDomainServiceImpl = OrderDomainServiceImpl;
OrderDomainServiceImpl.logger = {
    info: (message) => console.log(`[OrderDomainServiceImpl] ${message}`),
};
