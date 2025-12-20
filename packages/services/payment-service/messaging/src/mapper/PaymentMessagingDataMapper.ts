import { injectable } from 'tsyringe';
import { PaymentOrderStatus } from '@food-ordering-system/common-domain';
import { PaymentRequest, OrderEventPayload } from '@food-ordering-system/payment-application-service';

export interface PaymentRequestAvroModel {
  id: string;
  sagaId: string;
  orderId: string;
  customerId: string;
  price: number;
  createdAt: number;
  paymentOrderStatus: string;
}

export interface PaymentResponseAvroModel {
  id: string;
  sagaId: string;
  paymentId: string;
  customerId: string;
  orderId: string;
  price: number;
  createdAt: number;
  paymentStatus: string;
  failureMessages: string[];
}

@injectable()
export class PaymentMessagingDataMapper {
  paymentRequestAvroModelToPaymentRequest(avroModel: PaymentRequestAvroModel): PaymentRequest {
    return new PaymentRequest({
      id: avroModel.id,
      sagaId: avroModel.sagaId,
      orderId: avroModel.orderId,
      customerId: avroModel.customerId,
      price: avroModel.price,
      createdAt: new Date(avroModel.createdAt),
      paymentOrderStatus: this.stringToPaymentOrderStatus(avroModel.paymentOrderStatus),
    });
  }

  orderEventPayloadToPaymentResponseAvroModel(
    sagaId: string,
    orderEventPayload: OrderEventPayload
  ): PaymentResponseAvroModel {
    return {
      id: orderEventPayload.paymentId,
      sagaId,
      paymentId: orderEventPayload.paymentId,
      customerId: orderEventPayload.customerId,
      orderId: orderEventPayload.orderId,
      price: orderEventPayload.price,
      createdAt: orderEventPayload.createdAt.getTime(),
      paymentStatus: orderEventPayload.paymentStatus,
      failureMessages: orderEventPayload.failureMessages,
    };
  }

  private stringToPaymentOrderStatus(status: string): PaymentOrderStatus {
    switch (status) {
      case 'PENDING':
        return PaymentOrderStatus.PENDING;
      case 'CANCELLED':
        return PaymentOrderStatus.CANCELLED;
      default:
        throw new Error(`Unknown PaymentOrderStatus: ${status}`);
    }
  }
}
