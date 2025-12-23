import { Entity, PrimaryColumn, Column, VersionColumn } from 'typeorm';
import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';

@Entity('order_outbox')
export class OrderOutboxEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  sagaId!: string;

  @Column('timestamptz')
  createdAt!: Date;

  @Column('timestamptz', { nullable: true })
  processedAt!: Date;

  @Column('varchar')
  type!: string;

  @Column('jsonb')
  payload!: string;

  @Column({
    type: 'enum',
    enum: OutboxStatus
  })
  outboxStatus!: OutboxStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus
  })
  paymentStatus!: PaymentStatus;

  @VersionColumn()
  version!: number;
}
