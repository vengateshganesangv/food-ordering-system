import { CustomerModel } from '../../../../../dto/message/CustomerModel';

export interface CustomerMessageListener {
  customerCreated(customerModel: CustomerModel): Promise<void>;
}
