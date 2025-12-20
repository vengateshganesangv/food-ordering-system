import { Entity, PrimaryColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { OrderStatus } from '@food-ordering-system/common-domain';
import { OrderAddressEntity } from './OrderAddressEntity';
import { OrderItemEntity } from './OrderItemEntity';

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  customerId!: string;

  @Column('uuid')
  restaurantId!: string;

  @Column('uuid')
  trackingId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: string;

  @Column({ type: 'enum', enum: OrderStatus })
  orderStatus!: OrderStatus;

  @Column({ type: 'text', nullable: true })
  failureMessages?: string;

  @OneToOne(() => OrderAddressEntity, address => address.order, { cascade: true })
  address!: OrderAddressEntity;

  @OneToMany(() => OrderItemEntity, item => item.order, { cascade: true })
  items!: OrderItemEntity[];
}
