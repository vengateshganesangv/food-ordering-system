import { Entity, PrimaryColumn, Column } from 'typeorm';
import { OrderApprovalStatus } from '@food-ordering-system/common-domain';

/**
 * Order Approval Entity - TypeORM entity for restaurant.order_approval table
 * Represents an order approval decision made by a restaurant
 */
@Entity({ name: 'order_approval', schema: 'restaurant' })
export class OrderApprovalEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'restaurant_id' })
  restaurantId!: string;

  @Column('uuid', { name: 'order_id' })
  orderId!: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  status!: OrderApprovalStatus;
}
