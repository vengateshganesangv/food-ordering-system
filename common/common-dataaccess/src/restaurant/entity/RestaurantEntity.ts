import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * Restaurant Entity
 * Represents a materialized view joining restaurant and product information
 * Uses composite primary key (restaurantId, productId)
 */
@Entity('order_restaurant_m_view', { schema: 'restaurant' })
export class RestaurantEntity {
  /**
   * Restaurant unique identifier (part of composite key)
   */
  @PrimaryColumn('uuid')
  restaurantId!: string;

  /**
   * Product unique identifier (part of composite key)
   */
  @PrimaryColumn('uuid')
  productId!: string;

  /**
   * Name of the restaurant
   */
  @Column({ type: 'varchar', nullable: true })
  restaurantName!: string;

  /**
   * Whether the restaurant is currently active
   */
  @Column({ type: 'boolean', nullable: true })
  restaurantActive!: boolean;

  /**
   * Name of the product
   */
  @Column({ type: 'varchar', nullable: true })
  productName!: string;

  /**
   * Price of the product
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  productPrice!: number;

  /**
   * Whether the product is currently available
   */
  @Column({ type: 'boolean', nullable: true })
  productAvailable!: boolean;

  /**
   * Checks equality with another RestaurantEntity
   * Equality is based on the composite key (restaurantId, productId)
   * @param other - Another RestaurantEntity instance
   * @returns true if composite keys match
   */
  equals(other: RestaurantEntity): boolean {
    if (!other) return false;
    return this.restaurantId === other.restaurantId &&
           this.productId === other.productId;
  }

  /**
   * Generates hash code for this entity based on composite key
   * @returns hash code as number
   */
  hashCode(): number {
    let hash = 17;
    hash = hash * 31 + this.restaurantId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    hash = hash * 31 + this.productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash;
  }
}
