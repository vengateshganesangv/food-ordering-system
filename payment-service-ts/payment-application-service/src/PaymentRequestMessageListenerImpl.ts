import { Logger } from '@food-ordering-system/kafka-producer';
import { PaymentRequestMessageListener } from './ports/input/message/listener/PaymentRequestMessageListener';
import { PaymentRequest } from './dto/PaymentRequest';
import { PaymentRequestHelper } from './PaymentRequestHelper';

const logger = new Logger('PaymentRequestMessageListenerImpl');

export class PaymentRequestMessageListenerImpl implements PaymentRequestMessageListener {
  constructor(private readonly paymentRequestHelper: PaymentRequestHelper) {}

  public async completePayment(paymentRequest: PaymentRequest): Promise<void> {
    await this.paymentRequestHelper.persistPayment(paymentRequest);
  }

  public async cancelPayment(paymentRequest: PaymentRequest): Promise<void> {
    await this.paymentRequestHelper.persistCancelPayment(paymentRequest);
  }
}
