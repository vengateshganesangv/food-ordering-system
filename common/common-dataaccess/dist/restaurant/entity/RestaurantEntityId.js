"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantEntityId = void 0;
/**
 * Composite Primary Key for Restaurant Entity
 * Used as the primary key for RestaurantEntity
 */
class RestaurantEntityId {
    constructor(restaurantId, productId) {
        this.restaurantId = restaurantId || '';
        this.productId = productId || '';
    }
    /**
     * Checks equality with another RestaurantEntityId
     * @param other - Another RestaurantEntityId instance
     * @returns true if both restaurantId and productId match
     */
    equals(other) {
        if (!other)
            return false;
        return this.restaurantId === other.restaurantId &&
            this.productId === other.productId;
    }
    /**
     * Generates hash code for this composite key
     * @returns hash code as number
     */
    hashCode() {
        let hash = 17;
        hash = hash * 31 + this.restaurantId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        hash = hash * 31 + this.productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hash;
    }
}
exports.RestaurantEntityId = RestaurantEntityId;
//# sourceMappingURL=RestaurantEntityId.js.map