/**
 * Composite Primary Key for Restaurant Entity
 * Used as the primary key for RestaurantEntity
 */
export declare class RestaurantEntityId {
    restaurantId: string;
    productId: string;
    constructor(restaurantId?: string, productId?: string);
    /**
     * Checks equality with another RestaurantEntityId
     * @param other - Another RestaurantEntityId instance
     * @returns true if both restaurantId and productId match
     */
    equals(other: RestaurantEntityId): boolean;
    /**
     * Generates hash code for this composite key
     * @returns hash code as number
     */
    hashCode(): number;
}
//# sourceMappingURL=RestaurantEntityId.d.ts.map