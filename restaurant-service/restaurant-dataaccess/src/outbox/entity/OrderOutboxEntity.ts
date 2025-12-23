import { Entity, PrimaryColumn, Column } from 'typeorm';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderApprovalStatus } from '@food-ordering-system/common-domain';

/**
 * Order Outbox Entity - TypeORM entity for restaurant.order_outbox table
 * Implements the Outbox pattern for reliable message publishing
 */
@Entity({ name: 'order_outbox', schema: 'restaurant' })
export class OrderOutboxEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'saga_id' })
  sagaId!: string;

  @Column('timestamp with time zone', { name: 'created_at' })
  createdAt!: Date;

  @Column('timestamp with time zone', { name: 'processed_at', nullable: true })
  processedAt?: Date;

  @Column('varchar', { length: 255 })
  type!: string;

  @Column('text')
  payload!: string;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'outbox_status',
  })
  outboxStatus!: OutboxStatus;

  @Column({
    type: 'varchar',
    length: 50,
    name: 'approval_status',
  })
  approvalStatus!: OrderApprovalStatus;

  @Column('int')
  version!: number;

  equals(other: OrderOutboxEntity | null | undefined): boolean {
    if (!other) return false;
    if (this === other) return true;
    return this.id === other.id;
  }

  hashCode(): number {
    return this.id ? this.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  }
}
