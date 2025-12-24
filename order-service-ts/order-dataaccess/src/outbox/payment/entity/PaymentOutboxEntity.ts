import { Entity, PrimaryColumn, Column, VersionColumn } from 'typeorm';
import { OrderStatus, OutboxStatus, SagaStatus } from '@food-ordering-system/common-domain';

@Entity({ name: 'payment_outbox', schema: '"order"' })
export class PaymentOutboxEntity {
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

  @Column({ type: 'varchar', length: 50, name: 'saga_status' })
  sagaStatus!: SagaStatus;

  @Column({ type: 'varchar', length: 50, name: 'order_status' })
  orderStatus!: OrderStatus;

  @Column({ type: 'varchar', length: 50, name: 'outbox_status' })
  outboxStatus!: OutboxStatus;

  @VersionColumn()
  version!: number;
}
