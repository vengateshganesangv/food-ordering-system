"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDetail = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class OrderDetail extends common_domain_1.BaseEntity {
    constructor(orderId, orderStatus, totalAmount, products) {
        super();
        this.setId(orderId);
        this.orderStatus = orderStatus;
        this.totalAmount = totalAmount;
        this.products = products;
    }
    static builder() {
        return new OrderDetailBuilder();
    }
    getOrderStatus() {
        return this.orderStatus;
    }
    getTotalAmount() {
        return this.totalAmount;
    }
    getProducts() {
        return this.products;
    }
}
exports.OrderDetail = OrderDetail;
class OrderDetailBuilder {
    orderId(val) {
        this._orderId = val;
        return this;
    }
    orderStatus(val) {
        this._orderStatus = val;
        return this;
    }
    totalAmount(val) {
        this._totalAmount = val;
        return this;
    }
    products(val) {
        this._products = val;
        return this;
    }
    build() {
        if (!this._orderId || !this._orderStatus || !this._totalAmount || !this._products) {
            throw new Error('Missing required fields for OrderDetail');
        }
        return new OrderDetail(this._orderId, this._orderStatus, this._totalAmount, this._products);
    }
}
//# sourceMappingURL=OrderDetail.js.map