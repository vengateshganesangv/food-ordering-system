import { OrderStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';

export class OrderApprovalOutboxMessage {
  private _id!: string;
  private _sagaId!: string;
  private _createdAt!: Date;
  private _processedAt?: Date;
  private _type!: string;
  private _payload!: string;
  private _sagaStatus!: SagaStatus;
  private _orderStatus!: OrderStatus;
  private _outboxStatus!: OutboxStatus;
  private _version!: number;

  constructor(
    id: string,
    sagaId: string,
    createdAt: Date,
    processedAt: Date | undefined,
    type: string,
    payload: string,
    sagaStatus: SagaStatus,
    orderStatus: OrderStatus,
    outboxStatus: OutboxStatus,
    version: number
  ) {
    this._id = id;
    this._sagaId = sagaId;
    this._createdAt = createdAt;
    this._processedAt = processedAt;
    this._type = type;
    this._payload = payload;
    this._sagaStatus = sagaStatus;
    this._orderStatus = orderStatus;
    this._outboxStatus = outboxStatus;
    this._version = version;
  }

  get id(): string {
    return this._id;
  }

  get sagaId(): string {
    return this._sagaId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get processedAt(): Date | undefined {
    return this._processedAt;
  }

  get type(): string {
    return this._type;
  }

  get payload(): string {
    return this._payload;
  }

  get sagaStatus(): SagaStatus {
    return this._sagaStatus;
  }

  get orderStatus(): OrderStatus {
    return this._orderStatus;
  }

  get outboxStatus(): OutboxStatus {
    return this._outboxStatus;
  }

  get version(): number {
    return this._version;
  }

  setProcessedAt(processedAt: Date): void {
    this._processedAt = processedAt;
  }

  setSagaStatus(sagaStatus: SagaStatus): void {
    this._sagaStatus = sagaStatus;
  }

  setOrderStatus(orderStatus: OrderStatus): void {
    this._orderStatus = orderStatus;
  }

  setOutboxStatus(outboxStatus: OutboxStatus): void {
    this._outboxStatus = outboxStatus;
  }
}
