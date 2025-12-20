import { PaymentRequest } from '../../../dto/PaymentRequest';

export interface PaymentRequestMessageListener {
  completePayment(paymentRequest: PaymentRequest): Promise<void>;
  cancelPayment(paymentRequest: PaymentRequest): Promise<void>;
}
