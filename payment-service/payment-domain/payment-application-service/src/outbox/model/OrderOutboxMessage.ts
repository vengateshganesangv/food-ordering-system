import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';

export class OrderOutboxMessage {
  id!: string;
  sagaId!: string;
  createdAt!: Date;
  processedAt!: Date;
  type!: string;
  payload!: string;
  paymentStatus!: PaymentStatus;
  outboxStatus!: OutboxStatus;
  version!: number;

  constructor() {}

  static builder(): OrderOutboxMessageBuilder {
    return new OrderOutboxMessageBuilder();
  }

  setOutboxStatus(outboxStatus: OutboxStatus): void {
    this.outboxStatus = outboxStatus;
  }
}

class OrderOutboxMessageBuilder {
  private message: OrderOutboxMessage;

  constructor() {
    this.message = new OrderOutboxMessage();
  }

  id(id: string): OrderOutboxMessageBuilder {
    this.message.id = id;
    return this;
  }

  sagaId(sagaId: string): OrderOutboxMessageBuilder {
    this.message.sagaId = sagaId;
    return this;
  }

  createdAt(createdAt: Date): OrderOutboxMessageBuilder {
    this.message.createdAt = createdAt;
    return this;
  }

  processedAt(processedAt: Date): OrderOutboxMessageBuilder {
    this.message.processedAt = processedAt;
    return this;
  }

  type(type: string): OrderOutboxMessageBuilder {
    this.message.type = type;
    return this;
  }

  payload(payload: string): OrderOutboxMessageBuilder {
    this.message.payload = payload;
    return this;
  }

  paymentStatus(paymentStatus: PaymentStatus): OrderOutboxMessageBuilder {
    this.message.paymentStatus = paymentStatus;
    return this;
  }

  outboxStatus(outboxStatus: OutboxStatus): OrderOutboxMessageBuilder {
    this.message.outboxStatus = outboxStatus;
    return this;
  }

  version(version: number): OrderOutboxMessageBuilder {
    this.message.version = version;
    return this;
  }

  build(): OrderOutboxMessage {
    return this.message;
  }
}
