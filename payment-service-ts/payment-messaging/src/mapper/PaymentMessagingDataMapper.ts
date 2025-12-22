import { PaymentOrderStatus } from '@food-ordering-system/common-domain';
import { PaymentRequest, OrderEventPayload } from '@food-ordering-system/payment-application-service';
import { v4 as uuidv4 } from 'uuid';

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

export class PaymentMessagingDataMapper {
  public paymentRequestAvroModelToPaymentRequest(
    paymentRequestAvroModel: PaymentRequestAvroModel
  ): PaymentRequest {
    return new PaymentRequest(
      paymentRequestAvroModel.id,
      paymentRequestAvroModel.sagaId,
      paymentRequestAvroModel.orderId,
      paymentRequestAvroModel.customerId,
      paymentRequestAvroModel.price,
      paymentRequestAvroModel.createdAt,
      PaymentOrderStatus[paymentRequestAvroModel.paymentOrderStatus as keyof typeof PaymentOrderStatus]
    );
  }

  public orderEventPayloadToPaymentResponseAvroModel(
    sagaId: string,
    orderEventPayload: OrderEventPayload
  ): PaymentResponseAvroModel {
    return {
      id: uuidv4(),
      sagaId,
      paymentId: orderEventPayload.paymentId,
      customerId: orderEventPayload.customerId,
      orderId: orderEventPayload.orderId,
      price: orderEventPayload.price,
      createdAt: orderEventPayload.createdAt,
      paymentStatus: orderEventPayload.paymentStatus,
      failureMessages: orderEventPayload.failureMessages
    };
  }
}
