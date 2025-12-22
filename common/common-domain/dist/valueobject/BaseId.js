"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseId = void 0;
/**
 * Base class for value object identifiers
 * @template T - The type of the identifier value
 */
class BaseId {
    constructor(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    /**
     * Checks equality based on value
     */
    equals(other) {
        if (this === other) {
            return true;
        }
        if (!other || !(other instanceof BaseId)) {
            return false;
        }
        if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(other)) {
            return false;
        }
        const otherBaseId = other;
        return this.value === otherBaseId.value;
    }
    /**
     * Generates hash code based on value
     */
    hashCode() {
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
exports.BaseId = BaseId;
//# sourceMappingURL=BaseId.js.map