"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = void 0;
/**
 * Enum representing the status of a payment
 */
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
