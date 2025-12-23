import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';

/**
 * Order Outbox Message
 * Represents an outbox message for reliable messaging
 */
export class OrderOutboxMessage {
  constructor(
    private id: string,
    private sagaId: string,
    private createdAt: Date,
    private processedAt: Date | null,
    private type: string,
    private payload: string,
    private outboxStatus: OutboxStatus,
    private approvalStatus: OrderApprovalStatus,
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

  getProcessedAt(): Date | null {
    return this.processedAt;
  }

  getType(): string {
    return this.type;
  }

  getPayload(): string {
    return this.payload;
  }

  getOutboxStatus(): OutboxStatus {
    return this.outboxStatus;
  }

  getApprovalStatus(): OrderApprovalStatus {
    return this.approvalStatus;
  }

  getVersion(): number {
    return this.version;
  }

  setOutboxStatus(status: OutboxStatus): void {
    this.outboxStatus = status;
  }

  static Builder = class {
    private _id?: string;
    private _sagaId?: string;
    private _createdAt?: Date;
    private _processedAt: Date | null = null;
    private _type?: string;
    private _payload?: string;
    private _outboxStatus?: OutboxStatus;
    private _approvalStatus?: OrderApprovalStatus;
    private _version: number = 0;

    id(value: string): this {
      this._id = value;
      return this;
    }

    sagaId(value: string): this {
      this._sagaId = value;
      return this;
    }

    createdAt(value: Date): this {
      this._createdAt = value;
      return this;
    }

    processedAt(value: Date | null): this {
      this._processedAt = value;
      return this;
    }

    type(value: string): this {
      this._type = value;
      return this;
    }

    payload(value: string): this {
      this._payload = value;
      return this;
    }

    outboxStatus(value: OutboxStatus): this {
      this._outboxStatus = value;
      return this;
    }

    approvalStatus(value: OrderApprovalStatus): this {
      this._approvalStatus = value;
      return this;
    }

    version(value: number): this {
      this._version = value;
      return this;
    }

    build(): OrderOutboxMessage {
      if (!this._id || !this._sagaId || !this._createdAt || !this._type ||
          !this._payload || !this._outboxStatus || !this._approvalStatus) {
        throw new Error('Missing required fields for OrderOutboxMessage');
      }

      return new OrderOutboxMessage(
        this._id,
        this._sagaId,
        this._createdAt,
        this._processedAt,
        this._type,
        this._payload,
        this._outboxStatus,
        this._approvalStatus,
        this._version,
      );
    }
  };
}

export const OrderOutboxMessageBuilder = OrderOutboxMessage.Builder;
