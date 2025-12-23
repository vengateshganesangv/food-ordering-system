"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Restaurant = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const OrderApproval_1 = require("./OrderApproval");
const OrderApprovalId_1 = require("../valueobject/OrderApprovalId");
const uuid_1 = require("uuid");
class Restaurant extends common_domain_1.AggregateRoot {
    constructor(restaurantId, orderApproval, active, orderDetail) {
        super();
        this.setId(restaurantId);
        this.orderApproval = orderApproval;
        this.active = active;
        this.orderDetail = orderDetail;
    }
    validateOrder(failureMessages) {
        if (this.orderDetail.getOrderStatus() !== common_domain_1.OrderStatus.PAID) {
            failureMessages.push(`Payment is not completed for order: ${this.orderDetail.getId()?.getValue()}`);
        }
        const totalAmount = this.orderDetail.getProducts().reduce((acc, product) => {
            if (!product.isAvailable()) {
                failureMessages.push(`Product with id: ${product.getId()?.getValue()} is not available`);
            }
            const price = product.getPrice();
            if (price) {
                return acc.add(price.multiply(product.getQuantity()));
            }
            return acc;
        }, common_domain_1.Money.ZERO);
        if (!totalAmount.equals(this.orderDetail.getTotalAmount())) {
            failureMessages.push(`Price total is not correct for order: ${this.orderDetail.getId()?.getValue()}`);
        }
    }
    constructOrderApproval(orderApprovalStatus) {
        this.orderApproval = OrderApproval_1.OrderApproval.builder()
            .orderApprovalId(new OrderApprovalId_1.OrderApprovalId((0, uuid_1.v4)()))
            .restaurantId(this.getId())
            .orderId(this.orderDetail.getId())
            .approvalStatus(orderApprovalStatus)
            .build();
    }
    setActive(active) {
        this.active = active;
    }
    static builder() {
        return new RestaurantBuilder();
    }
    getOrderApproval() {
        return this.orderApproval;
    }
    isActive() {
        return this.active;
    }
    getOrderDetail() {
        return this.orderDetail;
    }
}
exports.Restaurant = Restaurant;
class RestaurantBuilder {
    constructor() {
        this._active = false;
    }
    restaurantId(val) {
        this._restaurantId = val;
        return this;
    }
    orderApproval(val) {
        this._orderApproval = val;
        return this;
    }
    active(val) {
        this._active = val;
        return this;
    }
    orderDetail(val) {
        this._orderDetail = val;
        return this;
    }
    build() {
        if (!this._restaurantId || !this._orderDetail) {
            throw new Error('Missing required fields for Restaurant');
        }
        return new Restaurant(this._restaurantId, this._orderApproval, this._active, this._orderDetail);
    }
}
//# sourceMappingURL=Restaurant.js.map