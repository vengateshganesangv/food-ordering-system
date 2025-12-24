import { Order } from './entity/Order';
import { Product } from './entity/Product';
import { Restaurant } from './entity/Restaurant';
import { OrderCreatedEvent } from './event/OrderCreatedEvent';
import { OrderPaidEvent } from './event/OrderPaidEvent';
import { OrderCancelledEvent } from './event/OrderCancelledEvent';
import { OrderDomainException } from './exception/OrderDomainException';
import { OrderDomainService } from './OrderDomainService';

/**
 * Order Domain Service Implementation
 * Implements core business logic for orders
 */
export class OrderDomainServiceImpl implements OrderDomainService {
  private static readonly logger = {
    info: (message: string) => console.log(`[OrderDomainServiceImpl] ${message}`),
  };

  validateAndInitiateOrder(order: Order, restaurant: Restaurant): OrderCreatedEvent {
    this.validateRestaurant(restaurant);
    this.setOrderProductInformation(order, restaurant);
    order.validateOrder();
    order.initializeOrder();
    OrderDomainServiceImpl.logger.info(`Order with id: ${order.getId()?.getValue()} is initiated`);
    return new OrderCreatedEvent(order, new Date());
  }

  payOrder(order: Order): OrderPaidEvent {
    order.pay();
    OrderDomainServiceImpl.logger.info(`Order with id: ${order.getId()?.getValue()} is paid`);
    return new OrderPaidEvent(order, new Date());
  }

  approveOrder(order: Order): void {
    order.approve();
    OrderDomainServiceImpl.logger.info(`Order with id: ${order.getId()?.getValue()} is approved`);
  }

  cancelOrderPayment(order: Order, failureMessages: string[]): OrderCancelledEvent {
    order.initCancel(failureMessages);
    OrderDomainServiceImpl.logger.info(`Order payment is cancelling for order id: ${order.getId()?.getValue()}`);
    return new OrderCancelledEvent(order, new Date());
  }

  cancelOrder(order: Order, failureMessages: string[]): void {
    order.cancel(failureMessages);
    OrderDomainServiceImpl.logger.info(`Order with id: ${order.getId()?.getValue()} is cancelled`);
  }

  private validateRestaurant(restaurant: Restaurant): void {
    if (!restaurant.isActive()) {
      throw new OrderDomainException(`Restaurant with id ${restaurant.getId()?.getValue()} is currently not active!`);
    }
  }

  private setOrderProductInformation(order: Order, restaurant: Restaurant): void {
    order.getItems().forEach((orderItem) => {
      restaurant.getProducts().forEach((restaurantProduct) => {
        const currentProduct = orderItem.getProduct();
        if (currentProduct.equals(restaurantProduct)) {
          const name = restaurantProduct.getName();
          const price = restaurantProduct.getPrice();
          if (name && price) {
            currentProduct.updateWithConfirmedNameAndPrice(name, price);
          }
        }
      });
    });
  }
}
