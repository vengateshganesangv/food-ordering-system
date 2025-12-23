import { RestaurantOrderStatus } from '@food-ordering-system/common-domain';
import { Product } from '../../../restaurant-domain-core/src/entity/Product';
/**
 * Restaurant Approval Request DTO
 * Contains order details for restaurant validation
 */
export interface RestaurantApprovalRequest {
    id: string;
    sagaId: string;
    restaurantId: string;
    orderId: string;
    restaurantOrderStatus: RestaurantOrderStatus;
    products: Product[];
    price: number;
    createdAt: Date;
}
/**
 * Builder for RestaurantApprovalRequest
 */
export declare class RestaurantApprovalRequestBuilder {
    private _id?;
    private _sagaId?;
    private _restaurantId?;
    private _orderId?;
    private _restaurantOrderStatus?;
    private _products?;
    private _price?;
    private _createdAt?;
    id(value: string): this;
    sagaId(value: string): this;
    restaurantId(value: string): this;
    orderId(value: string): this;
    restaurantOrderStatus(value: RestaurantOrderStatus): this;
    products(value: Product[]): this;
    price(value: number): this;
    createdAt(value: Date): this;
    build(): RestaurantApprovalRequest;
}
//# sourceMappingURL=RestaurantApprovalRequest.d.ts.map