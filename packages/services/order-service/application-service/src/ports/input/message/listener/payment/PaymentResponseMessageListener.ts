import { PaymentResponse } from '../../../../../dto/message/PaymentResponse';

export interface PaymentResponseMessageListener {
  paymentCompleted(paymentResponse: PaymentResponse): Promise<void>;
  paymentCancelled(paymentResponse: PaymentResponse): Promise<void>;
}
