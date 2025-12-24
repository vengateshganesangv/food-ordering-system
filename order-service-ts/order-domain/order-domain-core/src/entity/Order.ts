import {
  AggregateRoot,
  CustomerId,
  Money,
  OrderId,
  OrderStatus,
  RestaurantId,
} from '@food-ordering-system/common-domain';
import { OrderDomainException } from '../exception/OrderDomainException';
import { TrackingId } from '../valueobject/TrackingId';
import { StreetAddress } from '../valueobject/StreetAddress';
import { OrderItemId } from '../valueobject/OrderItemId';
import { OrderItem } from './OrderItem';
import { v4 as uuidv4 } from 'uuid';

/**
 * Order aggregate root
 * Main entity that orchestrates order state and business rules
 */
export class Order extends AggregateRoot<OrderId> {
  private readonly customerId: CustomerId;
  private readonly restaurantId: RestaurantId;
  private readonly deliveryAddress: StreetAddress;
  private readonly price: Money;
  private readonly items: OrderItem[];

  private trackingId?: TrackingId;
  private orderStatus?: OrderStatus;
  private failureMessages?: string[];

  static readonly FAILURE_MESSAGE_DELIMITER = ',';

  constructor(
    orderId: OrderId | undefined,
    customerId: CustomerId,
    restaurantId: RestaurantId,
    deliveryAddress: StreetAddress,
    price: Money,
    items: OrderItem[],
    trackingId?: TrackingId,
    orderStatus?: OrderStatus,
    failureMessages?: string[],
  ) {
    super();
    if (orderId) {
      this.setId(orderId);
    }
    this.customerId = customerId;
    this.restaurantId = restaurantId;
    this.deliveryAddress = deliveryAddress;
    this.price = price;
    this.items = items;
    this.trackingId = trackingId;
    this.orderStatus = orderStatus;
    this.failureMessages = failureMessages;
  }

  initializeOrder(): void {
    this.setId(new OrderId(uuidv4()));
    this.trackingId = new TrackingId(uuidv4());
    this.orderStatus = OrderStatus.PENDING;
    this.initializeOrderItems();
  }

  validateOrder(): void {
    this.validateInitialOrder();
    this.validateTotalPrice();
    this.validateItemsPrice();
  }

  pay(): void {
    if (this.orderStatus !== OrderStatus.PENDING) {
      throw new OrderDomainException('Order is not in correct state for pay operation!');
    }
    this.orderStatus = OrderStatus.PAID;
  }

  approve(): void {
    if (this.orderStatus !== OrderStatus.PAID) {
      throw new OrderDomainException('Order is not in correct state for approve operation!');
    }
    this.orderStatus = OrderStatus.APPROVED;
  }

  initCancel(failureMessages: string[]): void {
    if (this.orderStatus !== OrderStatus.PAID) {
      throw new OrderDomainException('Order is not in correct state for initCancel operation!');
    }
    this.orderStatus = OrderStatus.CANCELLING;
    this.updateFailureMessages(failureMessages);
  }

  cancel(failureMessages: string[]): void {
    if (!(this.orderStatus === OrderStatus.CANCELLING || this.orderStatus === OrderStatus.PENDING)) {
      throw new OrderDomainException('Order is not in correct state for cancel operation!');
    }
    this.orderStatus = OrderStatus.CANCELLED;
    this.updateFailureMessages(failureMessages);
  }

  private updateFailureMessages(failureMessages: string[]): void {
    if (this.failureMessages && failureMessages) {
      this.failureMessages.push(...failureMessages.filter((message) => message.length > 0));
    }
    if (!this.failureMessages) {
      this.failureMessages = failureMessages;
    }
  }

  private validateInitialOrder(): void {
    if (this.orderStatus || this.getId()) {
      throw new OrderDomainException('Order is not in correct state for initialization!');
    }
  }

  private validateTotalPrice(): void {
    if (!this.price || !this.price.isGreaterThanZero()) {
      throw new OrderDomainException('Total price must be greater than zero!');
    }
  }

  private validateItemsPrice(): void {
    const orderItemsTotal = this.items
      .map((orderItem) => {
        this.validateItemPrice(orderItem);
        return orderItem.getSubTotal();
      })
      .reduce((acc, subTotal) => acc.add(subTotal), Money.ZERO);

    if (!this.price.equals(orderItemsTotal)) {
      throw new OrderDomainException(
        `Total price: ${this.price.getAmount()} is not equal to Order items total: ${orderItemsTotal.getAmount()}!`,
      );
    }
  }

  private validateItemPrice(orderItem: OrderItem): void {
    if (!orderItem.isPriceValid()) {
      const productId = orderItem.getProduct().getId();
      throw new OrderDomainException(
        `Order item price: ${orderItem.getPrice().getAmount()} is not valid for product ${productId?.getValue()}`,
      );
    }
  }

  private initializeOrderItems(): void {
    let itemId = 1;
    for (const orderItem of this.items) {
      orderItem.initializeOrderItem(this.getId()!, new OrderItemId(itemId++));
    }
  }

  static builder(): OrderBuilder {
    return new OrderBuilder();
  }

  getCustomerId(): CustomerId {
    return this.customerId;
  }

  getRestaurantId(): RestaurantId {
    return this.restaurantId;
  }

  getDeliveryAddress(): StreetAddress {
    return this.deliveryAddress;
  }

  getPrice(): Money {
    return this.price;
  }

  getItems(): OrderItem[] {
    return this.items;
  }

  getTrackingId(): TrackingId | undefined {
    return this.trackingId;
  }

  getOrderStatus(): OrderStatus | undefined {
    return this.orderStatus;
  }

  getFailureMessages(): string[] | undefined {
    return this.failureMessages;
  }
}

class OrderBuilder {
  public _orderId?: OrderId;
  public _customerId?: CustomerId;
  public _restaurantId?: RestaurantId;
  public _deliveryAddress?: StreetAddress;
  public _price?: Money;
  public _items?: OrderItem[];
  public _trackingId?: TrackingId;
  public _orderStatus?: OrderStatus;
  public _failureMessages?: string[];

  orderId(val: OrderId): this {
    this._orderId = val;
    return this;
  }

  customerId(val: CustomerId): this {
    this._customerId = val;
    return this;
  }

  restaurantId(val: RestaurantId): this {
    this._restaurantId = val;
    return this;
  }

  deliveryAddress(val: StreetAddress): this {
    this._deliveryAddress = val;
    return this;
  }

  price(val: Money): this {
    this._price = val;
    return this;
  }

  items(val: OrderItem[]): this {
    this._items = val;
    return this;
  }

  trackingId(val: TrackingId): this {
    this._trackingId = val;
    return this;
  }

  orderStatus(val: OrderStatus): this {
    this._orderStatus = val;
    return this;
  }

  failureMessages(val: string[]): this {
    this._failureMessages = val;
    return this;
  }

  build(): Order {
    if (!this._customerId || !this._restaurantId || !this._deliveryAddress || !this._price || !this._items) {
      throw new Error('Missing required fields for Order');
    }
    return new Order(
      this._orderId,
      this._customerId,
      this._restaurantId,
      this._deliveryAddress,
      this._price,
      this._items,
      this._trackingId,
      this._orderStatus,
      this._failureMessages,
    );
  }
}
