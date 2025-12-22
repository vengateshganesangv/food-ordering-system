import { PaymentRequest } from '../../../../dto/PaymentRequest';

export interface PaymentRequestMessageListener {
  completePayment(paymentRequest: PaymentRequest): void;
  cancelPayment(paymentRequest: PaymentRequest): void;
}
