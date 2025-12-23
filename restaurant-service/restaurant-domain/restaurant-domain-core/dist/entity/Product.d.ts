import { BaseEntity, ProductId, Money } from '@food-ordering-system/common-domain';
export declare class Product extends BaseEntity<ProductId> {
    private name?;
    private price?;
    private readonly quantity;
    private available;
    constructor(productId: ProductId, name: string | undefined, price: Money | undefined, quantity: number, available: boolean);
    updateWithConfirmedNamePriceAndAvailability(name: string, price: Money, available: boolean): void;
    static builder(): ProductBuilder;
    getName(): string | undefined;
    getPrice(): Money | undefined;
    getQuantity(): number;
    isAvailable(): boolean;
}
declare class ProductBuilder {
    private _productId?;
    private _name?;
    private _price?;
    private _quantity?;
    private _available;
    productId(val: ProductId): this;
    name(val: string): this;
    price(val: Money): this;
    quantity(val: number): this;
    available(val: boolean): this;
    build(): Product;
}
export {};
//# sourceMappingURL=Product.d.ts.map