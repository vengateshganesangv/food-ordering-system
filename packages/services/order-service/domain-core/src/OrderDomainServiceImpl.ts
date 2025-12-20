import { injectable } from 'tsyringe';
import { OrderDomainService } from './OrderDomainService';
import { Order } from './entity/Order';
import { Restaurant } from './entity/Restaurant';
import { Product } from './entity/Product';
import { OrderCreatedEvent } from './event/OrderCreatedEvent';
import { OrderPaidEvent } from './event/OrderPaidEvent';
import { OrderCancelledEvent } from './event/OrderCancelledEvent';
import { OrderDomainException } from './exception/OrderDomainException';
import { UTC } from '@food-ordering-system/common-domain';

@injectable()
export class OrderDomainServiceImpl implements OrderDomainService {
  validateAndInitiateOrder(order: Order, restaurant: Restaurant): OrderCreatedEvent {
    this.validateRestaurant(restaurant);
    this.setOrderProductInformation(order, restaurant);
    order.validateOrder();
    order.initializeOrder();
    console.log(`Order with id: ${order.getId()!.getValue()} is initiated`);
    return new OrderCreatedEvent(order, new Date());
  }

  payOrder(order: Order): OrderPaidEvent {
    order.pay();
    console.log(`Order with id: ${order.getId()!.getValue()} is paid`);
    return new OrderPaidEvent(order, new Date());
  }

  approveOrder(order: Order): void {
    order.approve();
    console.log(`Order with id: ${order.getId()!.getValue()} is approved`);
  }

  cancelOrderPayment(order: Order, failureMessages: string[]): OrderCancelledEvent {
    order.initCancel(failureMessages);
    console.log(`Order payment is cancelling for order id: ${order.getId()!.getValue()}`);
    return new OrderCancelledEvent(order, new Date());
  }

  cancelOrder(order: Order, failureMessages: string[]): void {
    order.cancel(failureMessages);
    console.log(`Order with id: ${order.getId()!.getValue()} is cancelled`);
  }

  private validateRestaurant(restaurant: Restaurant): void {
    if (!restaurant.active) {
      throw new OrderDomainException(
        `Restaurant with id ${restaurant.getId()!.getValue()} is currently not active!`
      );
    }
  }

  private setOrderProductInformation(order: Order, restaurant: Restaurant): void {
    order.items.forEach(orderItem => {
      restaurant.products.forEach(restaurantProduct => {
        const currentProduct = orderItem.product;
        if (currentProduct.equals(restaurantProduct)) {
          currentProduct.updateWithConfirmedNameAndPrice(
            restaurantProduct.name!,
            restaurantProduct.price!
          );
        }
      });
    });
  }
}
