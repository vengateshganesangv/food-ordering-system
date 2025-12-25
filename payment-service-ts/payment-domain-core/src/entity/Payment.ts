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
    super();
    if (props.paymentId) {
      this.setId(props.paymentId);
    }
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

  public static builder(): InstanceType<typeof Payment.Builder> {
    return new Payment.Builder();
  }

  static Builder = class {
    public paymentId?: PaymentId;
    public orderId?: OrderId;
    public customerId?: CustomerId;
    public price?: Money;
    public paymentStatus?: PaymentStatus;
    public createdAt?: Date;

    public setPaymentId(paymentId: PaymentId): this {
      this.paymentId = paymentId;
      return this;
    }

    public setOrderId(orderId: OrderId): this {
      this.orderId = orderId;
      return this;
    }

    public setCustomerId(customerId: CustomerId): this {
      this.customerId = customerId;
      return this;
    }

    public setPrice(price: Money): this {
      this.price = price;
      return this;
    }

    public setPaymentStatus(paymentStatus: PaymentStatus): this {
      this.paymentStatus = paymentStatus;
      return this;
    }

    public setCreatedAt(createdAt: Date): this {
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
  };
}
