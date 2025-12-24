import { OrderDomainException } from '@food-ordering-system/order-domain-core';
import { CustomerModel } from './dto/message/CustomerModel';
import { CustomerMessageListener } from './ports/input/message/listener/customer/CustomerMessageListener';
import { CustomerRepository } from './ports/output/repository/CustomerRepository';
import { OrderDataMapper } from './mapper/OrderDataMapper';

/**
 * Customer Message Listener Implementation
 * Handles customer events from customer service
 */
export class CustomerMessageListenerImpl implements CustomerMessageListener {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[CustomerMessageListenerImpl] ${message}`, ...args),
    error: (message: string, ...args: any[]) => console.error(`[CustomerMessageListenerImpl] ${message}`, ...args),
  };

  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly orderDataMapper: OrderDataMapper,
  ) {}

  async customerCreated(customerModel: CustomerModel): Promise<void> {
    const customer = await this.customerRepository.save(this.orderDataMapper.customerModelToCustomer(customerModel));
    if (!customer) {
      CustomerMessageListenerImpl.logger.error(
        `Customer could not be created in order database with id: ${customerModel.getId()}`,
      );
      throw new OrderDomainException(`Customer could not be created in order database with id ${customerModel.getId()}`);
    }
    const customerId = customer.getId();
    CustomerMessageListenerImpl.logger.info(
      `Customer is created in order database with id: ${customerId ? customerId.getValue() : 'unknown'}`,
    );
  }
}
