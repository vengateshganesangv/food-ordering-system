import Decimal from 'decimal.js';

export class OrderPaymentEventPayload {
  orderId!: string;
  customerId!: string;
  price!: Decimal;
  createdAt!: Date;
  paymentOrderStatus!: string;

  constructor(
    orderId: string,
    customerId: string,
    price: Decimal,
    createdAt: Date,
    paymentOrderStatus: string
  ) {
    this.orderId = orderId;
    this.customerId = customerId;
    this.price = price;
    this.createdAt = createdAt;
    this.paymentOrderStatus = paymentOrderStatus;
  }
}
