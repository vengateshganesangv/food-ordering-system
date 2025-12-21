import { ValueObject } from './ValueObject';

export class Money extends ValueObject {
  private readonly _amount: number;

  constructor(amount: number) {
    super();
    this._amount = Number(amount.toFixed(2));
  }

  get amount(): number {
    return this._amount;
  }

  isGreaterThanZero(): boolean {
    return this._amount > 0;
  }

  isGreaterThan(money: Money): boolean {
    return this._amount > money.amount;
  }

  add(money: Money): Money {
    return new Money(this._amount + money.amount);
  }

  subtract(money: Money): Money {
    return new Money(this._amount - money.amount);
  }

  multiply(multiplier: number): Money {
    return new Money(this._amount * multiplier);
  }

  equals(other: ValueObject): boolean {
    if (!(other instanceof Money)) {
      return false;
    }
    return this._amount === other._amount;
  }

  static ZERO = new Money(0);
}
