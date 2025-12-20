import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './OrderEntity';

@Entity('order_address')
export class OrderAddressEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  street!: string;

  @Column()
  postalCode!: string;

  @Column()
  city!: string;

  @OneToOne(() => OrderEntity, order => order.address)
  @JoinColumn({ name: 'orderId' })
  order!: OrderEntity;
}
