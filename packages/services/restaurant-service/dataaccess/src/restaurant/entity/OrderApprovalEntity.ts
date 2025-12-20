import { Entity, PrimaryColumn, Column } from 'typeorm';
import { OrderApprovalStatus } from '@food-ordering-system/common-domain';

@Entity('order_approval')
export class OrderApprovalEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('uuid')
  restaurantId!: string;

  @Column('uuid')
  orderId!: string;

  @Column({
    type: 'enum',
    enum: OrderApprovalStatus,
  })
  status!: OrderApprovalStatus;
}
