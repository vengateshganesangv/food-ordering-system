import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';

export class OrderOutboxMessage {
  id!: string;
  sagaId!: string;
  createdAt!: Date;
  processedAt?: Date;
  type!: string;
  payload!: string;
  approvalStatus!: OrderApprovalStatus;
  outboxStatus!: OutboxStatus;
  version!: number;

  constructor(partial?: Partial<OrderOutboxMessage>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
