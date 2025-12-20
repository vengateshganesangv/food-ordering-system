import { injectable, inject } from 'tsyringe';
import { CustomerMessageListener } from './ports/input/message/listener/customer/CustomerMessageListener';
import { CustomerModel } from './dto/message/CustomerModel';
import { CustomerRepository } from './ports/output/repository/CustomerRepository';
import { OrderDataMapper } from './mapper/OrderDataMapper';

@injectable()
export class CustomerMessageListenerImpl implements CustomerMessageListener {
  constructor(
    @inject('CustomerRepository') private customerRepository: CustomerRepository,
    private orderDataMapper: OrderDataMapper
  ) {}

  async customerCreated(customerModel: CustomerModel): Promise<void> {
    const customer = this.orderDataMapper.customerModelToCustomer(customerModel);
    await this.customerRepository.save(customer);
    console.log('Customer created with id:', customer.getId()!.getValue());
  }
}
