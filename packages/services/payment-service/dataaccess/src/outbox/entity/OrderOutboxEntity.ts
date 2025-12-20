import { Entity, PrimaryColumn, Column, VersionColumn } from 'typeorm';
import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';

@Entity('order_outbox')
export class OrderOutboxEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  sagaId!: string;

  @Column('timestamp with time zone')
  createdAt!: Date;

  @Column('timestamp with time zone', { nullable: true })
  processedAt?: Date;

  @Column('varchar')
  type!: string;

  @Column('text')
  payload!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  paymentStatus!: PaymentStatus;

  @Column({
    type: 'enum',
    enum: OutboxStatus,
  })
  outboxStatus!: OutboxStatus;

  @VersionColumn()
  version!: number;
}
