import { Order } from '@food-ordering-system/order-domain-core';
import { PaymentResponse } from './dto/message/PaymentResponse';
import { PaymentResponseMessageListener } from './ports/input/message/listener/payment/PaymentResponseMessageListener';
import { OrderPaymentSaga } from './OrderPaymentSaga';

/**
 * Payment Response Message Listener Implementation
 * Handles payment response messages from payment service
 */
export class PaymentResponseMessageListenerImpl implements PaymentResponseMessageListener {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[PaymentResponseMessageListenerImpl] ${message}`, ...args),
  };

  constructor(private readonly orderPaymentSaga: OrderPaymentSaga) {}

  async paymentCompleted(paymentResponse: PaymentResponse): Promise<void> {
    await this.orderPaymentSaga.process(paymentResponse);
    PaymentResponseMessageListenerImpl.logger.info(
      `Order Payment Saga process operation is completed for order id: ${paymentResponse.getOrderId()}`,
    );
  }

  async paymentCancelled(paymentResponse: PaymentResponse): Promise<void> {
    await this.orderPaymentSaga.rollback(paymentResponse);
    PaymentResponseMessageListenerImpl.logger.info(
      `Order is roll backed for order id: ${paymentResponse.getOrderId()} with failure messages: ${paymentResponse.getFailureMessages().join(Order.FAILURE_MESSAGE_DELIMITER)}`,
    );
  }
}
