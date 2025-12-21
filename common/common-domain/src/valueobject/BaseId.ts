import { ValueObject } from './ValueObject';

export abstract class BaseId<T> extends ValueObject {
  private readonly _value: T;

  constructor(value: T) {
    super();
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  equals(other: ValueObject): boolean {
    if (!(other instanceof BaseId)) {
      return false;
    }
    return this._value === (other as BaseId<T>)._value;
  }

  toString(): string {
    return String(this._value);
  }
}
