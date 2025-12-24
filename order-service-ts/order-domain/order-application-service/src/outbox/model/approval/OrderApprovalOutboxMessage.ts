import { OrderStatus, OutboxStatus, SagaStatus } from '@food-ordering-system/common-domain';

/**
 * Order Approval Outbox Message
 * Outbox message for approval events
 */
export class OrderApprovalOutboxMessage {
  constructor(
    private id: string,
    private sagaId: string,
    private createdAt: Date,
    private processedAt: Date | undefined,
    private type: string,
    private payload: string,
    private sagaStatus: SagaStatus,
    private orderStatus: OrderStatus,
    private outboxStatus: OutboxStatus,
    private version: number,
  ) {}

  getId(): string {
    return this.id;
  }

  getSagaId(): string {
    return this.sagaId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getProcessedAt(): Date | undefined {
    return this.processedAt;
  }

  getType(): string {
    return this.type;
  }

  getPayload(): string {
    return this.payload;
  }

  getSagaStatus(): SagaStatus {
    return this.sagaStatus;
  }

  getOrderStatus(): OrderStatus {
    return this.orderStatus;
  }

  getOutboxStatus(): OutboxStatus {
    return this.outboxStatus;
  }

  getVersion(): number {
    return this.version;
  }

  setProcessedAt(processedAt: Date): void {
    this.processedAt = processedAt;
  }

  setSagaStatus(sagaStatus: SagaStatus): void {
    this.sagaStatus = sagaStatus;
  }

  setOrderStatus(orderStatus: OrderStatus): void {
    this.orderStatus = orderStatus;
  }

  setOutboxStatus(outboxStatus: OutboxStatus): void {
    this.outboxStatus = outboxStatus;
  }

  static builder(): OrderApprovalOutboxMessageBuilder {
    return new OrderApprovalOutboxMessageBuilder();
  }

  static Builder = class OrderApprovalOutboxMessageBuilder {
    public _id?: string;
    public _sagaId?: string;
    public _createdAt?: Date;
    public _processedAt?: Date;
    public _type?: string;
    public _payload?: string;
    public _sagaStatus?: SagaStatus;
    public _orderStatus?: OrderStatus;
    public _outboxStatus?: OutboxStatus;
    public _version?: number;

    id(val: string): this {
      this._id = val;
      return this;
    }

    sagaId(val: string): this {
      this._sagaId = val;
      return this;
    }

    createdAt(val: Date): this {
      this._createdAt = val;
      return this;
    }

    processedAt(val: Date | undefined): this {
      this._processedAt = val;
      return this;
    }

    type(val: string): this {
      this._type = val;
      return this;
    }

    payload(val: string): this {
      this._payload = val;
      return this;
    }

    sagaStatus(val: SagaStatus): this {
      this._sagaStatus = val;
      return this;
    }

    orderStatus(val: OrderStatus): this {
      this._orderStatus = val;
      return this;
    }

    outboxStatus(val: OutboxStatus): this {
      this._outboxStatus = val;
      return this;
    }

    version(val: number): this {
      this._version = val;
      return this;
    }

    build(): OrderApprovalOutboxMessage {
      if (
        !this._id ||
        !this._sagaId ||
        !this._createdAt ||
        !this._type ||
        !this._payload ||
        !this._sagaStatus ||
        !this._orderStatus ||
        !this._outboxStatus ||
        this._version === undefined
      ) {
        throw new Error('Missing required fields for OrderApprovalOutboxMessage');
      }
      return new OrderApprovalOutboxMessage(
        this._id,
        this._sagaId,
        this._createdAt,
        this._processedAt,
        this._type,
        this._payload,
        this._sagaStatus,
        this._orderStatus,
        this._outboxStatus,
        this._version,
      );
    }
  };
}
