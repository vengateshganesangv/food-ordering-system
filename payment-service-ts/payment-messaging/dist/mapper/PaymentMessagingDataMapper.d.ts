import { PaymentRequest, OrderEventPayload } from '@food-ordering-system/payment-application-service';
export interface PaymentRequestAvroModel {
    id: string;
    sagaId: string;
    customerId: string;
    orderId: string;
    price: number;
    createdAt: Date;
    paymentOrderStatus: string;
}
export interface PaymentResponseAvroModel {
    id: string;
    sagaId: string;
    paymentId: string;
    customerId: string;
    orderId: string;
    price: number;
    createdAt: Date;
    paymentStatus: string;
    failureMessages: string[];
}
export declare class PaymentMessagingDataMapper {
    paymentRequestAvroModelToPaymentRequest(paymentRequestAvroModel: PaymentRequestAvroModel): PaymentRequest;
    orderEventPayloadToPaymentResponseAvroModel(sagaId: string, orderEventPayload: OrderEventPayload): PaymentResponseAvroModel;
}
