import { injectable } from 'tsyringe';
import { PaymentResponseMessageListener } from './ports/input/message/listener/payment/PaymentResponseMessageListener';
import { PaymentResponse } from './dto/message/PaymentResponse';
import { OrderPaymentSaga } from './OrderPaymentSaga';

@injectable()
export class PaymentResponseMessageListenerImpl implements PaymentResponseMessageListener {
  constructor(private orderPaymentSaga: OrderPaymentSaga) {}

  async paymentCompleted(paymentResponse: PaymentResponse): Promise<void> {
    await this.orderPaymentSaga.process(paymentResponse);
  }

  async paymentCancelled(paymentResponse: PaymentResponse): Promise<void> {
    await this.orderPaymentSaga.rollback(paymentResponse);
  }
}
