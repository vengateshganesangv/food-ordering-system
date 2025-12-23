import { AggregateRoot, RestaurantId, OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OrderApproval } from './OrderApproval';
import { OrderDetail } from './OrderDetail';
export declare class Restaurant extends AggregateRoot<RestaurantId> {
    private orderApproval?;
    private active;
    private readonly orderDetail;
    constructor(restaurantId: RestaurantId, orderApproval: OrderApproval | undefined, active: boolean, orderDetail: OrderDetail);
    validateOrder(failureMessages: string[]): void;
    constructOrderApproval(orderApprovalStatus: OrderApprovalStatus): void;
    setActive(active: boolean): void;
    static builder(): RestaurantBuilder;
    getOrderApproval(): OrderApproval | undefined;
    isActive(): boolean;
    getOrderDetail(): OrderDetail;
}
declare class RestaurantBuilder {
    private _restaurantId?;
    private _orderApproval?;
    private _active;
    private _orderDetail?;
    restaurantId(val: RestaurantId): this;
    orderApproval(val: OrderApproval): this;
    active(val: boolean): this;
    orderDetail(val: OrderDetail): this;
    build(): Restaurant;
}
export {};
//# sourceMappingURL=Restaurant.d.ts.map