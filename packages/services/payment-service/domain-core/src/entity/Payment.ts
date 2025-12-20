import { AggregateRoot, OrderId, CustomerId, Money, PaymentStatus } from '@food-ordering-system/common-domain';
import { PaymentId } from '../valueobject/PaymentId';
import { v4 as uuidv4 } from 'uuid';

interface PaymentProps {
  paymentId?: PaymentId;
  orderId: OrderId;
  customerId: CustomerId;
  price: Money;
  paymentStatus?: PaymentStatus;
  createdAt?: Date;
}

export class Payment extends AggregateRoot<PaymentId> {
  private readonly _orderId: OrderId;
  private readonly _customerId: CustomerId;
  private readonly _price: Money;

  private _paymentStatus?: PaymentStatus;
  private _createdAt?: Date;

  private constructor(props: PaymentProps) {
    super();
    if (props.paymentId) {
      this.setId(props.paymentId);
    }
    this._orderId = props.orderId;
    this._customerId = props.customerId;
    this._price = props.price;
    this._paymentStatus = props.paymentStatus;
    this._createdAt = props.createdAt;
  }

  static builder(): PaymentBuilder {
    return new PaymentBuilder();
  }

  initializePayment(): void {
    this.setId(new PaymentId(uuidv4()));
    this._createdAt = new Date();
  }

  validatePayment(failureMessages: string[]): void {
    if (!this._price || !this._price.isGreaterThanZero()) {
      failureMessages.push('Total price must be greater than zero!');
    }
  }

  updateStatus(paymentStatus: PaymentStatus): void {
    this._paymentStatus = paymentStatus;
  }

  get orderId(): OrderId {
    return this._orderId;
  }

  get customerId(): CustomerId {
    return this._customerId;
  }

  get price(): Money {
    return this._price;
  }

  get paymentStatus(): PaymentStatus | undefined {
    return this._paymentStatus;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }
}

class PaymentBuilder {
  private paymentId?: PaymentId;
  private orderId?: OrderId;
  private customerId?: CustomerId;
  private price?: Money;
  private paymentStatus?: PaymentStatus;
  private createdAt?: Date;

  setPaymentId(paymentId: PaymentId): PaymentBuilder {
    this.paymentId = paymentId;
    return this;
  }

  setOrderId(orderId: OrderId): PaymentBuilder {
    this.orderId = orderId;
    return this;
  }

  setCustomerId(customerId: CustomerId): PaymentBuilder {
    this.customerId = customerId;
    return this;
  }

  setPrice(price: Money): PaymentBuilder {
    this.price = price;
    return this;
  }

  setPaymentStatus(paymentStatus: PaymentStatus): PaymentBuilder {
    this.paymentStatus = paymentStatus;
    return this;
  }

  setCreatedAt(createdAt: Date): PaymentBuilder {
    this.createdAt = createdAt;
    return this;
  }

  build(): Payment {
    if (!this.orderId || !this.customerId || !this.price) {
      throw new Error('OrderId, CustomerId, and Price are required');
    }
    return new Payment({
      paymentId: this.paymentId,
      orderId: this.orderId,
      customerId: this.customerId,
      price: this.price,
      paymentStatus: this.paymentStatus,
      createdAt: this.createdAt,
    });
  }
}
