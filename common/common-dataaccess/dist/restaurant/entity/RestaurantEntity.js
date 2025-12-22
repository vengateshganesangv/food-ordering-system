"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantEntity = void 0;
const typeorm_1 = require("typeorm");
/**
 * Restaurant Entity
 * Represents a materialized view joining restaurant and product information
 * Uses composite primary key (restaurantId, productId)
 */
let RestaurantEntity = class RestaurantEntity {
    /**
     * Checks equality with another RestaurantEntity
     * Equality is based on the composite key (restaurantId, productId)
     * @param other - Another RestaurantEntity instance
     * @returns true if composite keys match
     */
    equals(other) {
        if (!other)
            return false;
        return this.restaurantId === other.restaurantId &&
            this.productId === other.productId;
    }
    /**
     * Generates hash code for this entity based on composite key
     * @returns hash code as number
     */
    hashCode() {
        let hash = 17;
        hash = hash * 31 + this.restaurantId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        hash = hash * 31 + this.productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hash;
    }
};
exports.RestaurantEntity = RestaurantEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], RestaurantEntity.prototype, "restaurantId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], RestaurantEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], RestaurantEntity.prototype, "restaurantName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], RestaurantEntity.prototype, "restaurantActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], RestaurantEntity.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], RestaurantEntity.prototype, "productPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', nullable: true }),
    __metadata("design:type", Boolean)
], RestaurantEntity.prototype, "productAvailable", void 0);
exports.RestaurantEntity = RestaurantEntity = __decorate([
    (0, typeorm_1.Entity)('order_restaurant_m_view', { schema: 'restaurant' })
], RestaurantEntity);
//# sourceMappingURL=RestaurantEntity.js.map