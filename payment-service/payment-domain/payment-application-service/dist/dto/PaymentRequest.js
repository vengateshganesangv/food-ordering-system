"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequest = void 0;
class PaymentRequest {
    id;
    sagaId;
    orderId;
    customerId;
    price;
    createdAt;
    paymentOrderStatus;
    constructor(data) {
        if (data) {
            Object.assign(this, data);
        }
    }
    setPaymentOrderStatus(paymentOrderStatus) {
        this.paymentOrderStatus = paymentOrderStatus;
    }
}
exports.PaymentRequest = PaymentRequest;
//# sourceMappingURL=PaymentRequest.js.map