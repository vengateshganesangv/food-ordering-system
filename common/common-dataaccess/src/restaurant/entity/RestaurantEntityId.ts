/**
 * Composite Primary Key for Restaurant Entity
 * Used as the primary key for RestaurantEntity
 */
export class RestaurantEntityId {
  restaurantId: string;
  productId: string;

  constructor(restaurantId?: string, productId?: string) {
    this.restaurantId = restaurantId || '';
    this.productId = productId || '';
  }

  /**
   * Checks equality with another RestaurantEntityId
   * @param other - Another RestaurantEntityId instance
   * @returns true if both restaurantId and productId match
   */
  equals(other: RestaurantEntityId): boolean {
    if (!other) return false;
    return this.restaurantId === other.restaurantId &&
           this.productId === other.productId;
  }

  /**
   * Generates hash code for this composite key
   * @returns hash code as number
   */
  hashCode(): number {
    let hash = 17;
    hash = hash * 31 + this.restaurantId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    hash = hash * 31 + this.productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash;
  }
}
