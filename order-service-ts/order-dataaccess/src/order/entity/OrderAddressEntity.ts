import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './OrderEntity';

@Entity({ name: 'order_address' })
export class OrderAddressEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @OneToOne(() => OrderEntity, (order) => order.address, { cascade: true })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column('varchar', { length: 255 })
  street!: string;

  @Column('varchar', { length: 50, name: 'postal_code' })
  postalCode!: string;

  @Column('varchar', { length: 100 })
  city!: string;
}
