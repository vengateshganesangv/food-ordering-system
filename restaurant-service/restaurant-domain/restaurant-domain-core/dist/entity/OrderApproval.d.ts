import { BaseEntity, OrderId, RestaurantId, OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OrderApprovalId } from '../valueobject/OrderApprovalId';
export declare class OrderApproval extends BaseEntity<OrderApprovalId> {
    private readonly restaurantId;
    private readonly orderId;
    private readonly approvalStatus;
    constructor(orderApprovalId: OrderApprovalId, restaurantId: RestaurantId, orderId: OrderId, approvalStatus: OrderApprovalStatus);
    static builder(): OrderApprovalBuilder;
    getRestaurantId(): RestaurantId;
    getOrderId(): OrderId;
    getApprovalStatus(): OrderApprovalStatus;
}
declare class OrderApprovalBuilder {
    private _orderApprovalId?;
    private _restaurantId?;
    private _orderId?;
    private _approvalStatus?;
    orderApprovalId(val: OrderApprovalId): this;
    restaurantId(val: RestaurantId): this;
    orderId(val: OrderId): this;
    approvalStatus(val: OrderApprovalStatus): this;
    build(): OrderApproval;
}
export {};
//# sourceMappingURL=OrderApproval.d.ts.map