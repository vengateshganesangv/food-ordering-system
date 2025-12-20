import { PaymentStatus } from '@food-ordering-system/common-domain';
import Decimal from 'decimal.js';

export class PaymentResponse {
  id!: string;
  sagaId!: string;
  orderId!: string;
  paymentId!: string;
  customerId!: string;
  price!: Decimal;
  createdAt!: Date;
  paymentStatus!: PaymentStatus;
  failureMessages!: string[];

  constructor(
    id: string,
    sagaId: string,
    orderId: string,
    paymentId: string,
    customerId: string,
    price: Decimal,
    createdAt: Date,
    paymentStatus: PaymentStatus,
    failureMessages: string[]
  ) {
    this.id = id;
    this.sagaId = sagaId;
    this.orderId = orderId;
    this.paymentId = paymentId;
    this.customerId = customerId;
    this.price = price;
    this.createdAt = createdAt;
    this.paymentStatus = paymentStatus;
    this.failureMessages = failureMessages;
  }
}
