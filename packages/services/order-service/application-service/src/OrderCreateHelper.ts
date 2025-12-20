import { injectable, inject } from 'tsyringe';
import { CustomerId } from '@food-ordering-system/common-domain';
import { Order, Restaurant, Customer, OrderCreatedEvent, OrderDomainService, OrderDomainException } from '@food-ordering-system/order-domain-core';
import { CreateOrderCommand } from './dto/create/CreateOrderCommand';
import { OrderDataMapper } from './mapper/OrderDataMapper';
import { OrderRepository } from './ports/output/repository/OrderRepository';
import { CustomerRepository } from './ports/output/repository/CustomerRepository';
import { RestaurantRepository } from './ports/output/repository/RestaurantRepository';

@injectable()
export class OrderCreateHelper {
  constructor(
    @inject('OrderDomainService') private orderDomainService: OrderDomainService,
    @inject('OrderRepository') private orderRepository: OrderRepository,
    @inject('CustomerRepository') private customerRepository: CustomerRepository,
    @inject('RestaurantRepository') private restaurantRepository: RestaurantRepository,
    private orderDataMapper: OrderDataMapper
  ) {}

  async persistOrder(createOrderCommand: CreateOrderCommand): Promise<OrderCreatedEvent> {
    await this.checkCustomer(createOrderCommand.customerId);
    const restaurant = await this.checkRestaurant(createOrderCommand);
    const order = this.orderDataMapper.createOrderCommandToOrder(createOrderCommand);
    const orderCreatedEvent = this.orderDomainService.validateAndInitiateOrder(order, restaurant);
    await this.saveOrder(order);
    const orderId = orderCreatedEvent.order.getId();
    console.log('Order is created with id:', orderId ? orderId.getValue() : 'unknown');
    return orderCreatedEvent;
  }

  private async checkRestaurant(createOrderCommand: CreateOrderCommand): Promise<Restaurant> {
    const restaurant = this.orderDataMapper.createOrderCommandToRestaurant(createOrderCommand);
    const optionalRestaurant = await this.restaurantRepository.findRestaurantInformation(restaurant);
    if (!optionalRestaurant) {
      console.warn('Could not find restaurant with restaurant id:', createOrderCommand.restaurantId);
      throw new OrderDomainException('Could not find restaurant with restaurant id: ' + createOrderCommand.restaurantId);
    }
    return optionalRestaurant;
  }

  private async checkCustomer(customerId: string): Promise<void> {
    const customer = await this.customerRepository.findById(new CustomerId(customerId));
    if (!customer) {
      console.warn('Could not find customer with customer id:', customerId);
      throw new OrderDomainException('Could not find customer with customer id: ' + customerId);
    }
  }

  private async saveOrder(order: Order): Promise<Order> {
    const orderResult = await this.orderRepository.save(order);
    if (!orderResult) {
      console.error('Could not save order!');
      throw new OrderDomainException('Could not save order!');
    }
    const orderId = orderResult.getId();
    console.log('Order is saved with id:', orderId ? orderId.getValue() : 'unknown');
    return orderResult;
  }
}
