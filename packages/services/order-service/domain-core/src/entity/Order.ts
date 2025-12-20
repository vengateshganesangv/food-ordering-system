import { AggregateRoot, OrderId, CustomerId, RestaurantId, Money, OrderStatus } from '@food-ordering-system/common-domain';
import { StreetAddress } from '../valueobject/StreetAddress';
import { TrackingId } from '../valueobject/TrackingId';
import { OrderItemId } from '../valueobject/OrderItemId';
import { OrderItem } from './OrderItem';
import { OrderDomainException } from '../exception/OrderDomainException';
import { v4 as uuidv4 } from 'uuid';

interface OrderProps {
  orderId?: OrderId;
  customerId: CustomerId;
  restaurantId: RestaurantId;
  deliveryAddress: StreetAddress;
  price: Money;
  items: OrderItem[];
  trackingId?: TrackingId;
  orderStatus?: OrderStatus;
  failureMessages?: string[];
}

export class Order extends AggregateRoot<OrderId> {
  private readonly _customerId: CustomerId;
  private readonly _restaurantId: RestaurantId;
  private readonly _deliveryAddress: StreetAddress;
  private readonly _price: Money;
  private readonly _items: OrderItem[];

  private _trackingId?: TrackingId;
  private _orderStatus?: OrderStatus;
  private _failureMessages?: string[];

  public static readonly FAILURE_MESSAGE_DELIMITER = ',';

  private constructor(props: OrderProps) {
    super();
    if (props.orderId) {
      this.setId(props.orderId);
    }
    this._customerId = props.customerId;
    this._restaurantId = props.restaurantId;
    this._deliveryAddress = props.deliveryAddress;
    this._price = props.price;
    this._items = props.items;
    this._trackingId = props.trackingId;
    this._orderStatus = props.orderStatus;
    this._failureMessages = props.failureMessages;
  }

  static builder(): OrderBuilder {
    return new OrderBuilder();
  }

  initializeOrder(): void {
    this.setId(new OrderId(uuidv4()));
    this._trackingId = new TrackingId(uuidv4());
    this._orderStatus = OrderStatus.PENDING;
    this.initializeOrderItems();
  }

  validateOrder(): void {
    this.validateInitialOrder();
    this.validateTotalPrice();
    this.validateItemsPrice();
  }

  pay(): void {
    if (this._orderStatus !== OrderStatus.PENDING) {
      throw new OrderDomainException('Order is not in correct state for pay operation!');
    }
    this._orderStatus = OrderStatus.PAID;
  }

  approve(): void {
    if (this._orderStatus !== OrderStatus.PAID) {
      throw new OrderDomainException('Order is not in correct state for approve operation!');
    }
    this._orderStatus = OrderStatus.APPROVED;
  }

  initCancel(failureMessages: string[]): void {
    if (this._orderStatus !== OrderStatus.PAID) {
      throw new OrderDomainException('Order is not in correct state for initCancel operation!');
    }
    this._orderStatus = OrderStatus.CANCELLING;
    this.updateFailureMessages(failureMessages);
  }

  cancel(failureMessages: string[]): void {
    if (!(this._orderStatus === OrderStatus.CANCELLING || this._orderStatus === OrderStatus.PENDING)) {
      throw new OrderDomainException('Order is not in correct state for cancel operation!');
    }
    this._orderStatus = OrderStatus.CANCELLED;
    this.updateFailureMessages(failureMessages);
  }

  private updateFailureMessages(failureMessages: string[]): void {
    if (this._failureMessages && failureMessages) {
      this._failureMessages.push(...failureMessages.filter(message => message && message.length > 0));
    }
    if (!this._failureMessages) {
      this._failureMessages = failureMessages;
    }
  }

  private validateInitialOrder(): void {
    if (this._orderStatus || this.getId()) {
      throw new OrderDomainException('Order is not in correct state for initialization!');
    }
  }

  private validateTotalPrice(): void {
    if (!this._price || !this._price.isGreaterThanZero()) {
      throw new OrderDomainException('Total price must be greater than zero!');
    }
  }

  private validateItemsPrice(): void {
    const orderItemsTotal = this._items
      .map(orderItem => {
        this.validateItemPrice(orderItem);
        return orderItem.subTotal;
      })
      .reduce((acc, subTotal) => acc.add(subTotal), Money.ZERO);

    if (!this._price.equals(orderItemsTotal)) {
      throw new OrderDomainException(
        `Total price: ${this._price.getAmount()} is not equal to Order items total: ${orderItemsTotal.getAmount()}!`
      );
    }
  }

  private validateItemPrice(orderItem: OrderItem): void {
    if (!orderItem.isPriceValid()) {
      throw new OrderDomainException(
        `Order item price: ${orderItem.price.getAmount()} is not valid for product ${orderItem.product.getId()!.getValue()}`
      );
    }
  }

  private initializeOrderItems(): void {
    let itemId = 1;
    for (const orderItem of this._items) {
      orderItem.initializeOrderItem(this.getId()!, new OrderItemId(itemId++));
    }
  }

  get customerId(): CustomerId {
    return this._customerId;
  }

  get restaurantId(): RestaurantId {
    return this._restaurantId;
  }

  get deliveryAddress(): StreetAddress {
    return this._deliveryAddress;
  }

  get price(): Money {
    return this._price;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get trackingId(): TrackingId | undefined {
    return this._trackingId;
  }

  get orderStatus(): OrderStatus | undefined {
    return this._orderStatus;
  }

  get failureMessages(): string[] | undefined {
    return this._failureMessages;
  }
}

class OrderBuilder {
  private orderId?: OrderId;
  private customerId?: CustomerId;
  private restaurantId?: RestaurantId;
  private deliveryAddress?: StreetAddress;
  private price?: Money;
  private items: OrderItem[] = [];
  private trackingId?: TrackingId;
  private orderStatus?: OrderStatus;
  private failureMessages?: string[];

  setOrderId(orderId: OrderId): OrderBuilder {
    this.orderId = orderId;
    return this;
  }

  setCustomerId(customerId: CustomerId): OrderBuilder {
    this.customerId = customerId;
    return this;
  }

  setRestaurantId(restaurantId: RestaurantId): OrderBuilder {
    this.restaurantId = restaurantId;
    return this;
  }

  setDeliveryAddress(deliveryAddress: StreetAddress): OrderBuilder {
    this.deliveryAddress = deliveryAddress;
    return this;
  }

  setPrice(price: Money): OrderBuilder {
    this.price = price;
    return this;
  }

  setItems(items: OrderItem[]): OrderBuilder {
    this.items = items;
    return this;
  }

  setTrackingId(trackingId: TrackingId): OrderBuilder {
    this.trackingId = trackingId;
    return this;
  }

  setOrderStatus(orderStatus: OrderStatus): OrderBuilder {
    this.orderStatus = orderStatus;
    return this;
  }

  setFailureMessages(failureMessages: string[]): OrderBuilder {
    this.failureMessages = failureMessages;
    return this;
  }

  build(): Order {
    if (!this.customerId || !this.restaurantId || !this.deliveryAddress || !this.price) {
      throw new Error('CustomerId, RestaurantId, DeliveryAddress, and Price are required');
    }
    return new Order({
      orderId: this.orderId,
      customerId: this.customerId,
      restaurantId: this.restaurantId,
      deliveryAddress: this.deliveryAddress,
      price: this.price,
      items: this.items,
      trackingId: this.trackingId,
      orderStatus: this.orderStatus,
      failureMessages: this.failureMessages,
    });
  }
}
