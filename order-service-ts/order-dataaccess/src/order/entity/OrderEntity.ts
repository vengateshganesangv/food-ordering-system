import { Entity, PrimaryColumn, Column, OneToOne, OneToMany } from 'typeorm';
import { OrderStatus } from '@food-ordering-system/common-domain';
import { OrderAddressEntity } from './OrderAddressEntity';
import { OrderItemEntity } from './OrderItemEntity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'customer_id' })
  customerId!: string;

  @Column('uuid', { name: 'restaurant_id' })
  restaurantId!: string;

  @Column('uuid', { name: 'tracking_id' })
  trackingId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'varchar', length: 50, name: 'order_status' })
  orderStatus!: OrderStatus;

  @Column('text', { name: 'failure_messages', nullable: true })
  failureMessages?: string;

  @OneToOne(() => OrderAddressEntity, (address) => address.order, { cascade: true })
  address?: OrderAddressEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items?: OrderItemEntity[];
}
