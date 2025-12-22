"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
/**
 * Value object representing monetary amounts
 * Uses number internally with proper rounding to 2 decimal places
 */
class Money {
    constructor(amount) {
        this.amount = this.setScale(amount);
    }
    /**
     * Checks if the amount is greater than zero
     */
    isGreaterThanZero() {
        return this.amount > 0;
    }
    /**
     * Checks if this amount is greater than another
     */
    isGreaterThan(money) {
        return this.amount > money.getAmount();
    }
    /**
     * Adds two monetary amounts
     */
    add(money) {
        return new Money(this.amount + money.getAmount());
    }
    /**
     * Subtracts a monetary amount from this one
     */
    subtract(money) {
        return new Money(this.amount - money.getAmount());
    }
    /**
     * Multiplies the amount by an integer multiplier
     */
    multiply(multiplier) {
        return new Money(this.amount * multiplier);
    }
    /**
     * Gets the amount value
     */
    getAmount() {
        return this.amount;
    }
    /**
     * Checks equality based on amount
     */
    equals(other) {
        if (this === other) {
            return true;
        }
        if (!other || !(other instanceof Money)) {
            return false;
        }
        return this.amount === other.amount;
    }
    /**
     * Generates hash code based on amount
     */
    hashCode() {
        // Convert to string with 2 decimal places for consistent hashing
        const amountStr = this.amount.toFixed(2);
        let hash = 0;
        for (let i = 0; i < amountStr.length; i++) {
            const char = amountStr.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
    /**
     * Rounds to 2 decimal places using banker's rounding (round half to even)
     * This mimics Java's RoundingMode.HALF_EVEN
     */
    setScale(input) {
        // Multiply by 100, round, then divide by 100
        const factor = 100;
        const temp = input * factor;
        const rounded = Math.round(temp);
        // Handle banker's rounding (round half to even)
        if (Math.abs(temp - rounded) === 0.5) {
            // If the rounded value is odd, we need to adjust
            if (rounded % 2 !== 0) {
                return temp > 0
                    ? (rounded - 1) / factor
                    : (rounded + 1) / factor;
            }
        }
        return rounded / factor;
    }
}
exports.Money = Money;
Money.ZERO = new Money(0);
//# sourceMappingURL=Money.js.map