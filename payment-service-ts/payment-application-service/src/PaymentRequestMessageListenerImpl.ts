import { logger } from '@food-ordering-system/common-domain';
import { PaymentRequestMessageListener } from './ports/input/message/listener/PaymentRequestMessageListener';
import { PaymentRequest } from './dto/PaymentRequest';
import { PaymentRequestHelper } from './PaymentRequestHelper';

export class PaymentRequestMessageListenerImpl implements PaymentRequestMessageListener {
  constructor(private readonly paymentRequestHelper: PaymentRequestHelper) {}

  public async completePayment(paymentRequest: PaymentRequest): Promise<void> {
    await this.paymentRequestHelper.persistPayment(paymentRequest);
  }

  public async cancelPayment(paymentRequest: PaymentRequest): Promise<void> {
    await this.paymentRequestHelper.persistCancelPayment(paymentRequest);
  }
}
