import { PaymentStatus } from '@food-ordering-system/common-domain';

/**
 * Payment Response DTO
 * Represents payment response message from payment service
 */
export class PaymentResponse {
  constructor(
    private readonly id: string,
    private readonly sagaId: string,
    private readonly orderId: string,
    private readonly paymentId: string,
    private readonly customerId: string,
    private readonly price: number,
    private readonly createdAt: Date,
    private readonly paymentStatus: PaymentStatus,
    private readonly failureMessages: string[],
  ) {}

  getId(): string {
    return this.id;
  }

  getSagaId(): string {
    return this.sagaId;
  }

  getOrderId(): string {
    return this.orderId;
  }

  getPaymentId(): string {
    return this.paymentId;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getPrice(): number {
    return this.price;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getPaymentStatus(): PaymentStatus {
    return this.paymentStatus;
  }

  getFailureMessages(): string[] {
    return this.failureMessages;
  }

  static builder(): InstanceType<typeof PaymentResponse.Builder> {
    return new PaymentResponse.Builder();
  }

  static Builder = class {
    public _id?: string;
    public _sagaId?: string;
    public _orderId?: string;
    public _paymentId?: string;
    public _customerId?: string;
    public _price?: number;
    public _createdAt?: Date;
    public _paymentStatus?: PaymentStatus;
    public _failureMessages?: string[];

    id(val: string): this {
      this._id = val;
      return this;
    }

    sagaId(val: string): this {
      this._sagaId = val;
      return this;
    }

    orderId(val: string): this {
      this._orderId = val;
      return this;
    }

    paymentId(val: string): this {
      this._paymentId = val;
      return this;
    }

    customerId(val: string): this {
      this._customerId = val;
      return this;
    }

    price(val: number): this {
      this._price = val;
      return this;
    }

    createdAt(val: Date): this {
      this._createdAt = val;
      return this;
    }

    paymentStatus(val: PaymentStatus): this {
      this._paymentStatus = val;
      return this;
    }

    failureMessages(val: string[]): this {
      this._failureMessages = val;
      return this;
    }

    build(): PaymentResponse {
      if (
        !this._id ||
        !this._sagaId ||
        !this._orderId ||
        !this._paymentId ||
        !this._customerId ||
        this._price === undefined ||
        !this._createdAt ||
        !this._paymentStatus ||
        !this._failureMessages
      ) {
        throw new Error('Missing required fields for PaymentResponse');
      }
      return new PaymentResponse(
        this._id,
        this._sagaId,
        this._orderId,
        this._paymentId,
        this._customerId,
        this._price,
        this._createdAt,
        this._paymentStatus,
        this._failureMessages,
      );
    }
  };
}
