import Decimal from 'decimal.js';

export class Money {
  private readonly amount: Decimal;

  static readonly ZERO = new Money(new Decimal(0));

  constructor(amount: Decimal | number | string) {
    this.amount = new Decimal(amount);
  }

  isGreaterThanZero(): boolean {
    return this.amount.greaterThan(0);
  }

  isGreaterThan(money: Money): boolean {
    return this.amount.greaterThan(money.amount);
  }

  add(money: Money): Money {
    return new Money(this.setScale(this.amount.plus(money.amount)));
  }

  subtract(money: Money): Money {
    return new Money(this.setScale(this.amount.minus(money.amount)));
  }

  multiply(multiplier: number): Money {
    return new Money(this.setScale(this.amount.times(multiplier)));
  }

  getAmount(): Decimal {
    return this.amount;
  }

  equals(other: unknown): boolean {
    if (this === other) return true;
    if (!(other instanceof Money)) return false;
    return this.amount.equals(other.amount);
  }

  hashCode(): string {
    return this.amount.toString();
  }

  private setScale(input: Decimal): Decimal {
    return input.toDecimalPlaces(2, Decimal.ROUND_HALF_EVEN);
  }
}
