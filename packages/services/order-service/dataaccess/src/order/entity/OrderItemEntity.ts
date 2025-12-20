import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderEntity } from './OrderEntity';

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryColumn()
  id!: number;

  @PrimaryColumn('uuid')
  orderId!: string;

  @Column('uuid')
  productId!: string;

  @Column('int')
  quantity!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  subTotal!: string;

  @ManyToOne(() => OrderEntity, order => order.items)
  @JoinColumn({ name: 'orderId' })
  order!: OrderEntity;
}
