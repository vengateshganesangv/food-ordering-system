import Decimal from 'decimal.js';

export class Money {
  private readonly amount: Decimal;

  static readonly ZERO = new Money(new Decimal(0));

  constructor(amount: Decimal | number | string) {
    this.amount = new Decimal(amount).toDecimalPlaces(2, Decimal.ROUND_HALF_EVEN);
  }

  isGreaterThanZero(): boolean {
    return this.amount.greaterThan(0);
  }

  isGreaterThan(money: Money): boolean {
    return this.amount.greaterThan(money.amount);
  }

  add(money: Money): Money {
    return new Money(this.amount.plus(money.amount));
  }

  subtract(money: Money): Money {
    return new Money(this.amount.minus(money.amount));
  }

  multiply(multiplier: number): Money {
    return new Money(this.amount.times(multiplier));
  }

  getAmount(): Decimal {
    return this.amount;
  }

  equals(other: unknown): boolean {
    if (this === other) return true;
    if (!other || !(other instanceof Money)) return false;
    return this.amount.equals(other.amount);
  }

  toString(): string {
    return this.amount.toFixed(2);
  }

  toNumber(): number {
    return this.amount.toNumber();
  }
}
