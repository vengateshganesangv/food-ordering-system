import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './OrderEntity';

@Entity({ name: 'order_items' })
export class OrderItemEntity {
  @PrimaryColumn('bigint')
  id!: number;

  @PrimaryColumn('uuid', { name: 'order_id' })
  orderId!: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, { cascade: true })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column('uuid', { name: 'product_id' })
  productId!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column('int')
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'sub_total' })
  subTotal!: number;
}
