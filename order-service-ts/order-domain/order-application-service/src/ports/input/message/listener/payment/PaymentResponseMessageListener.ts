import { PaymentResponse } from '../../../../../dto/message/PaymentResponse';

/**
 * Payment Response Message Listener interface
 * Input port for handling payment response messages
 */
export interface PaymentResponseMessageListener {
  /**
   * Handles payment completed event
   * @param paymentResponse Payment response from payment service
   */
  paymentCompleted(paymentResponse: PaymentResponse): Promise<void>;

  /**
   * Handles payment cancelled event
   * @param paymentResponse Payment response from payment service
   */
  paymentCancelled(paymentResponse: PaymentResponse): Promise<void>;
}
