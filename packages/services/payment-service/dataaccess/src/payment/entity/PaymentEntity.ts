import { Entity, PrimaryColumn, Column } from 'typeorm';
import { PaymentStatus } from '@food-ordering-system/common-domain';

@Entity('payments')
export class PaymentEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  customerId!: string;

  @Column('uuid')
  orderId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status!: PaymentStatus;

  @Column('timestamp with time zone')
  createdAt!: Date;
}
