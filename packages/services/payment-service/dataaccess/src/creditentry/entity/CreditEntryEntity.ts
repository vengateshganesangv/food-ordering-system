import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('credit_entry')
export class CreditEntryEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  customerId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalCreditAmount!: number;
}
