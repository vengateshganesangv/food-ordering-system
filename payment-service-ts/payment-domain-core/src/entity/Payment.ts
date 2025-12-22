import { AggregateRoot, CustomerId, Money, OrderId, PaymentStatus } from '@food-ordering-system/common-domain';
import { PaymentId } from '../valueobject/PaymentId';
import { v4 as uuidv4 } from 'uuid';

export interface PaymentProps {
  paymentId?: PaymentId;
  orderId: OrderId;
  customerId: CustomerId;
  price: Money;
  paymentStatus?: PaymentStatus;
  createdAt?: Date;
}

export class Payment extends AggregateRoot<PaymentId> {
  private readonly orderId: OrderId;
  private readonly customerId: CustomerId;
  private readonly price: Money;

  private paymentStatus?: PaymentStatus;
  private createdAt?: Date;

  private constructor(props: PaymentProps) {
    super(props.paymentId!);
    this.orderId = props.orderId;
    this.customerId = props.customerId;
    this.price = props.price;
    this.paymentStatus = props.paymentStatus;
    this.createdAt = props.createdAt;
  }

  public initializePayment(): void {
    this.setId(new PaymentId(uuidv4()));
    this.createdAt = new Date();
  }

  public validatePayment(failureMessages: string[]): void {
    if (!this.price || !this.price.isGreaterThanZero()) {
      failureMessages.push('Total price must be greater than zero!');
    }
  }

  public updateStatus(paymentStatus: PaymentStatus): void {
    this.paymentStatus = paymentStatus;
  }

  public getOrderId(): OrderId {
    return this.orderId;
  }

  public getCustomerId(): CustomerId {
    return this.customerId;
  }

  public getPrice(): Money {
    return this.price;
  }

  public getPaymentStatus(): PaymentStatus | undefined {
    return this.paymentStatus;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public static builder(): PaymentBuilder {
    return new PaymentBuilder();
  }
}

class PaymentBuilder {
  private paymentId?: PaymentId;
  private orderId?: OrderId;
  private customerId?: CustomerId;
  private price?: Money;
  private paymentStatus?: PaymentStatus;
  private createdAt?: Date;

  public setPaymentId(paymentId: PaymentId): PaymentBuilder {
    this.paymentId = paymentId;
    return this;
  }

  public setOrderId(orderId: OrderId): PaymentBuilder {
    this.orderId = orderId;
    return this;
  }

  public setCustomerId(customerId: CustomerId): PaymentBuilder {
    this.customerId = customerId;
    return this;
  }

  public setPrice(price: Money): PaymentBuilder {
    this.price = price;
    return this;
  }

  public setPaymentStatus(paymentStatus: PaymentStatus): PaymentBuilder {
    this.paymentStatus = paymentStatus;
    return this;
  }

  public setCreatedAt(createdAt: Date): PaymentBuilder {
    this.createdAt = createdAt;
    return this;
  }

  public build(): Payment {
    return new Payment({
      paymentId: this.paymentId,
      orderId: this.orderId!,
      customerId: this.customerId!,
      price: this.price!,
      paymentStatus: this.paymentStatus,
      createdAt: this.createdAt
    });
  }
}
