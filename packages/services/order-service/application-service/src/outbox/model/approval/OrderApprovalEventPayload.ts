import Decimal from 'decimal.js';
import { OrderApprovalEventProduct } from './OrderApprovalEventProduct';

export class OrderApprovalEventPayload {
  orderId!: string;
  restaurantId!: string;
  price!: Decimal;
  createdAt!: Date;
  restaurantOrderStatus!: string;
  products!: OrderApprovalEventProduct[];

  constructor(
    orderId: string,
    restaurantId: string,
    price: Decimal,
    createdAt: Date,
    restaurantOrderStatus: string,
    products: OrderApprovalEventProduct[]
  ) {
    this.orderId = orderId;
    this.restaurantId = restaurantId;
    this.price = price;
    this.createdAt = createdAt;
    this.restaurantOrderStatus = restaurantOrderStatus;
    this.products = products;
  }
}
