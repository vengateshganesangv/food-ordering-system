import { Entity, PrimaryColumn, Column } from 'typeorm';
import Decimal from 'decimal.js';

@Entity({ name: 'order_restaurant_m_view', schema: 'restaurant' })
export class RestaurantEntity {
  @PrimaryColumn({ type: 'uuid' })
  restaurantId!: string;

  @PrimaryColumn({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'varchar' })
  restaurantName!: string;

  @Column({ type: 'boolean' })
  restaurantActive!: boolean;

  @Column({ type: 'varchar' })
  productName!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  productPrice!: Decimal;

  @Column({ type: 'boolean', nullable: true })
  productAvailable?: boolean;
}
