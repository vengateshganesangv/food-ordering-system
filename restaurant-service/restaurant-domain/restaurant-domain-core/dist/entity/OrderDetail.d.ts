import { BaseEntity, OrderId, Money, OrderStatus } from '@food-ordering-system/common-domain';
import { Product } from './Product';
export declare class OrderDetail extends BaseEntity<OrderId> {
    private orderStatus;
    private totalAmount;
    private readonly products;
    constructor(orderId: OrderId, orderStatus: OrderStatus, totalAmount: Money, products: Product[]);
    static builder(): OrderDetailBuilder;
    getOrderStatus(): OrderStatus;
    getTotalAmount(): Money;
    getProducts(): Product[];
}
declare class OrderDetailBuilder {
    private _orderId?;
    private _orderStatus?;
    private _totalAmount?;
    private _products?;
    orderId(val: OrderId): this;
    orderStatus(val: OrderStatus): this;
    totalAmount(val: Money): this;
    products(val: Product[]): this;
    build(): OrderDetail;
}
export {};
//# sourceMappingURL=OrderDetail.d.ts.map