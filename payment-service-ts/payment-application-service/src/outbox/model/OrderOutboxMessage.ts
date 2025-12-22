import { PaymentStatus, OutboxStatus } from '@food-ordering-system/common-domain';

export class OrderOutboxMessage {
  constructor(
    public id: string,
    public sagaId: string,
    public createdAt: Date,
    public processedAt: Date,
    public type: string,
    public payload: string,
    public paymentStatus: PaymentStatus,
    public outboxStatus: OutboxStatus,
    public version: number
  ) {}

  public setOutboxStatus(outboxStatus: OutboxStatus): void {
    this.outboxStatus = outboxStatus;
  }

  public static builder(): OrderOutboxMessageBuilder {
    return new OrderOutboxMessageBuilder();
  }
}

class OrderOutboxMessageBuilder {
  private id?: string;
  private sagaId?: string;
  private createdAt?: Date;
  private processedAt?: Date;
  private type?: string;
  private payload?: string;
  private paymentStatus?: PaymentStatus;
  private outboxStatus?: OutboxStatus;
  private version: number = 0;

  public setId(id: string): OrderOutboxMessageBuilder {
    this.id = id;
    return this;
  }

  public setSagaId(sagaId: string): OrderOutboxMessageBuilder {
    this.sagaId = sagaId;
    return this;
  }

  public setCreatedAt(createdAt: Date): OrderOutboxMessageBuilder {
    this.createdAt = createdAt;
    return this;
  }

  public setProcessedAt(processedAt: Date): OrderOutboxMessageBuilder {
    this.processedAt = processedAt;
    return this;
  }

  public setType(type: string): OrderOutboxMessageBuilder {
    this.type = type;
    return this;
  }

  public setPayload(payload: string): OrderOutboxMessageBuilder {
    this.payload = payload;
    return this;
  }

  public setPaymentStatus(paymentStatus: PaymentStatus): OrderOutboxMessageBuilder {
    this.paymentStatus = paymentStatus;
    return this;
  }

  public setOutboxStatus(outboxStatus: OutboxStatus): OrderOutboxMessageBuilder {
    this.outboxStatus = outboxStatus;
    return this;
  }

  public setVersion(version: number): OrderOutboxMessageBuilder {
    this.version = version;
    return this;
  }

  public build(): OrderOutboxMessage {
    return new OrderOutboxMessage(
      this.id!,
      this.sagaId!,
      this.createdAt!,
      this.processedAt!,
      this.type!,
      this.payload!,
      this.paymentStatus!,
      this.outboxStatus!,
      this.version
    );
  }
}
