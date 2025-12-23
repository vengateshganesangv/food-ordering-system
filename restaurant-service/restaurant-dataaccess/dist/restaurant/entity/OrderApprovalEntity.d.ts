import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
/**
 * Order Approval Entity - TypeORM entity for restaurant.order_approval table
 * Represents an order approval decision made by a restaurant
 */
export declare class OrderApprovalEntity {
    id: string;
    restaurantId: string;
    orderId: string;
    status: OrderApprovalStatus;
}
