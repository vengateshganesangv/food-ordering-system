import { Entity, PrimaryColumn, Column } from 'typeorm';
import { TransactionType } from '@food-ordering-system/payment-domain-core';

@Entity('credit_history')
export class CreditHistoryEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  customerId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type!: TransactionType;
}
