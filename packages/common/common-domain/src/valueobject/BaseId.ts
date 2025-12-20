export abstract class BaseId<T> {
  private readonly _value: T;

  protected constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  equals(other: unknown): boolean {
    if (this === other) return true;
    if (!other || this.constructor !== other.constructor) return false;
    const that = other as BaseId<T>;
    return this._value === that._value;
  }

  hashCode(): string {
    return String(this._value);
  }
}
