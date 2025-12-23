"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
class Product extends common_domain_1.BaseEntity {
    constructor(productId, name, price, quantity, available) {
        super();
        this.setId(productId);
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.available = available;
    }
    updateWithConfirmedNamePriceAndAvailability(name, price, available) {
        this.name = name;
        this.price = price;
        this.available = available;
    }
    static builder() {
        return new ProductBuilder();
    }
    getName() {
        return this.name;
    }
    getPrice() {
        return this.price;
    }
    getQuantity() {
        return this.quantity;
    }
    isAvailable() {
        return this.available;
    }
}
exports.Product = Product;
class ProductBuilder {
    constructor() {
        this._available = false;
    }
    productId(val) {
        this._productId = val;
        return this;
    }
    name(val) {
        this._name = val;
        return this;
    }
    price(val) {
        this._price = val;
        return this;
    }
    quantity(val) {
        this._quantity = val;
        return this;
    }
    available(val) {
        this._available = val;
        return this;
    }
    build() {
        if (!this._productId || this._quantity === undefined) {
            throw new Error('Missing required fields for Product');
        }
        return new Product(this._productId, this._name, this._price, this._quantity, this._available);
    }
}
//# sourceMappingURL=Product.js.map