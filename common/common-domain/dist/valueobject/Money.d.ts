/**
 * Value object representing monetary amounts
 * Uses number internally with proper rounding to 2 decimal places
 */
export declare class Money {
    private readonly amount;
    static readonly ZERO: Money;
    constructor(amount: number);
    /**
     * Checks if the amount is greater than zero
     */
    isGreaterThanZero(): boolean;
    /**
     * Checks if this amount is greater than another
     */
    isGreaterThan(money: Money): boolean;
    /**
     * Adds two monetary amounts
     */
    add(money: Money): Money;
    /**
     * Subtracts a monetary amount from this one
     */
    subtract(money: Money): Money;
    /**
     * Multiplies the amount by an integer multiplier
     */
    multiply(multiplier: number): Money;
    /**
     * Gets the amount value
     */
    getAmount(): number;
    /**
     * Checks equality based on amount
     */
    equals(other: unknown): boolean;
    /**
     * Generates hash code based on amount
     */
    hashCode(): number;
    /**
     * Rounds to 2 decimal places using banker's rounding (round half to even)
     * This mimics Java's RoundingMode.HALF_EVEN
     */
    private setScale;
}
//# sourceMappingURL=Money.d.ts.map