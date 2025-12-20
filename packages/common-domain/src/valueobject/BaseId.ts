export abstract class BaseId<T> {
  constructor(private readonly value: T) {}

  getValue(): T {
    return this.value;
  }

  equals(other: unknown): boolean {
    if (this === other) return true;
    if (!other || this.constructor !== other.constructor) return false;
    const otherId = other as BaseId<T>;
    return this.value === otherId.value;
  }

  toString(): string {
    return String(this.value);
  }
}
