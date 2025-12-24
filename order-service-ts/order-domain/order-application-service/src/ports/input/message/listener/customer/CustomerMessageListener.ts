import { CustomerModel } from '../../../../../dto/message/CustomerModel';

/**
 * Customer Message Listener interface
 * Input port for handling customer events
 */
export interface CustomerMessageListener {
  /**
   * Handles customer created event
   * @param customerModel Customer data from customer service
   */
  customerCreated(customerModel: CustomerModel): Promise<void>;
}
