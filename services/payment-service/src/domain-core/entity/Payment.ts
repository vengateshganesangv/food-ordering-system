import { AggregateRoot, OrderId, CustomerId, Money, PaymentStatus } from '@food-ordering/common-domain';

export class Payment extends AggregateRoot<string> {
  constructor(
    paymentId: string,
    private readonly orderId: OrderId,
    private readonly customerId: CustomerId,
    private readonly price: Money,
    private status: PaymentStatus,
  ) {
    super();
    this.setId(paymentId);
  }

  getOrderId(): OrderId {
    return this.orderId;
  }

  getCustomerId(): CustomerId {
    return this.customerId;
  }

  getPrice(): Money {
    return this.price;
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  setStatus(status: PaymentStatus): void {
    this.status = status;
  }
}
