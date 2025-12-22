/**
 * Restaurant Entity
 * Represents a materialized view joining restaurant and product information
 * Uses composite primary key (restaurantId, productId)
 */
export declare class RestaurantEntity {
    /**
     * Restaurant unique identifier (part of composite key)
     */
    restaurantId: string;
    /**
     * Product unique identifier (part of composite key)
     */
    productId: string;
    /**
     * Name of the restaurant
     */
    restaurantName: string;
    /**
     * Whether the restaurant is currently active
     */
    restaurantActive: boolean;
    /**
     * Name of the product
     */
    productName: string;
    /**
     * Price of the product
     */
    productPrice: number;
    /**
     * Whether the product is currently available
     */
    productAvailable: boolean;
    /**
     * Checks equality with another RestaurantEntity
     * Equality is based on the composite key (restaurantId, productId)
     * @param other - Another RestaurantEntity instance
     * @returns true if composite keys match
     */
    equals(other: RestaurantEntity): boolean;
    /**
     * Generates hash code for this entity based on composite key
     * @returns hash code as number
     */
    hashCode(): number;
}
//# sourceMappingURL=RestaurantEntity.d.ts.map