import { injectable } from 'tsyringe';
import { PaymentRequestMessageListener } from './ports/input/message/PaymentRequestMessageListener';
import { PaymentRequest } from './dto/PaymentRequest';
import { PaymentRequestHelper } from './PaymentRequestHelper';

@injectable()
export class PaymentRequestMessageListenerImpl implements PaymentRequestMessageListener {
  constructor(private readonly paymentRequestHelper: PaymentRequestHelper) {}

  async completePayment(paymentRequest: PaymentRequest): Promise<void> {
    await this.paymentRequestHelper.persistPayment(paymentRequest);
  }

  async cancelPayment(paymentRequest: PaymentRequest): Promise<void> {
    await this.paymentRequestHelper.persistCancelPayment(paymentRequest);
  }
}
