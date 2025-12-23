import { PaymentRequest } from './dto/PaymentRequest';
import { PaymentRequestMessageListener } from './ports/input/message/listener/PaymentRequestMessageListener';
import { PaymentRequestHelper } from './PaymentRequestHelper';

export class PaymentRequestMessageListenerImpl implements PaymentRequestMessageListener {
  constructor(private readonly paymentRequestHelper: PaymentRequestHelper) {}

  async completePayment(paymentRequest: PaymentRequest): Promise<void> {
    await this.paymentRequestHelper.persistPayment(paymentRequest);
  }

  async cancelPayment(paymentRequest: PaymentRequest): Promise<void> {
    await this.paymentRequestHelper.persistCancelPayment(paymentRequest);
  }
}
