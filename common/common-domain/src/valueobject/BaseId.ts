/**
 * Base class for value object identifiers
 * @template T - The type of the identifier value
 */
export abstract class BaseId<T> {
  private readonly value: T;

  protected constructor(value: T) {
    this.value = value;
  }

  public getValue(): T {
    return this.value;
  }

  /**
   * Checks equality based on value
   */
  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }

    if (!other || !(other instanceof BaseId)) {
      return false;
    }

    if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(other)) {
      return false;
    }

    const otherBaseId = other as BaseId<T>;
    return this.value === otherBaseId.value;
  }

  /**
   * Generates hash code based on value
   */
  public hashCode(): number {
    if (!this.value) {
      return 0;
    }

    // Simple hash function for primitive types and strings
    const valueStr = String(this.value);
    let hash = 0;
    for (let i = 0; i < valueStr.length; i++) {
      const char = valueStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}
