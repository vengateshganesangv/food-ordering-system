import { PaymentRequest } from '../dto/PaymentRequest';
import { Payment, PaymentEvent } from '@food-ordering-system/payment-domain-core';
import { OrderEventPayload } from '../outbox/model/OrderEventPayload';
export declare class PaymentDataMapper {
    paymentRequestModelToPayment(paymentRequest: PaymentRequest): Payment;
    paymentEventToOrderEventPayload(paymentEvent: PaymentEvent): OrderEventPayload;
}
//# sourceMappingURL=PaymentDataMapper.d.ts.map