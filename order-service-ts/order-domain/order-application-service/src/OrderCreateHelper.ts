import { v4 as uuidv4 } from 'uuid';
import { OrderDomainService, Order, Restaurant, Customer, OrderCreatedEvent } from '@food-ordering-system/order-domain-core';
import { CreateOrderCommand } from './dto/create/CreateOrderCommand';
import { OrderDataMapper } from './mapper/OrderDataMapper';
import { OrderRepository } from './ports/output/repository/OrderRepository';
import { CustomerRepository } from './ports/output/repository/CustomerRepository';
import { RestaurantRepository } from './ports/output/repository/RestaurantRepository';

/**
 * Order Create Helper
 * Helper class for order creation operations
 */
export class OrderCreateHelper {
  private static readonly logger = {
    info: (message: string, ...args: any[]) => console.log(`[OrderCreateHelper] ${message}`, ...args),
    warn: (message: string, ...args: any[]) => console.warn(`[OrderCreateHelper] ${message}`, ...args),
    error: (message: string, ...args: any[]) => console.error(`[OrderCreateHelper] ${message}`, ...args),
  };

  constructor(
    private readonly orderDomainService: OrderDomainService,
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly restaurantRepository: RestaurantRepository,
    private readonly orderDataMapper: OrderDataMapper,
  ) {}

  async persistOrder(createOrderCommand: CreateOrderCommand): Promise<OrderCreatedEvent> {
    await this.checkCustomer(createOrderCommand.getCustomerId());
    const restaurant = await this.checkRestaurant(createOrderCommand);
    const order = this.orderDataMapper.createOrderCommandToOrder(createOrderCommand);
    const orderCreatedEvent = this.orderDomainService.validateAndInitiateOrder(order, restaurant);
    await this.saveOrder(order);
    const orderId = orderCreatedEvent.getOrder().getId();
    OrderCreateHelper.logger.info(`Order is created with id: ${orderId ? orderId.getValue() : 'unknown'}`);
    return orderCreatedEvent;
  }

  private async checkRestaurant(createOrderCommand: CreateOrderCommand): Promise<Restaurant> {
    const restaurant = this.orderDataMapper.createOrderCommandToRestaurant(createOrderCommand);
    const optionalRestaurant = await this.restaurantRepository.findRestaurantInformation(restaurant);
    if (!optionalRestaurant) {
      OrderCreateHelper.logger.warn(`Could not find restaurant with restaurant id: ${createOrderCommand.getRestaurantId()}`);
      throw new Error(`Could not find restaurant with restaurant id: ${createOrderCommand.getRestaurantId()}`);
    }
    return optionalRestaurant;
  }

  private async checkCustomer(customerId: string): Promise<void> {
    const customer = await this.customerRepository.findCustomer(customerId);
    if (!customer) {
      OrderCreateHelper.logger.warn(`Could not find customer with customer id: ${customerId}`);
      throw new Error(`Could not find customer with customer id: ${customerId}`);
    }
  }

  private async saveOrder(order: Order): Promise<Order> {
    const orderResult = await this.orderRepository.save(order);
    if (!orderResult) {
      OrderCreateHelper.logger.error('Could not save order!');
      throw new Error('Could not save order!');
    }
    const orderId = orderResult.getId();
    OrderCreateHelper.logger.info(`Order is saved with id: ${orderId ? orderId.getValue() : 'unknown'}`);
    return orderResult;
  }
}
