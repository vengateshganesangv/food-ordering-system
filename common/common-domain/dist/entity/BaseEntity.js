"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEntity = void 0;
/**
 * Base entity class with identity
 * @template ID - The type of the entity's identifier
 */
class BaseEntity {
    getId() {
        return this._id;
    }
    setId(id) {
        this._id = id;
    }
    /**
     * Checks equality based on ID
     * Two entities are equal if they have the same ID and are of the same type
     */
    equals(other) {
        if (this === other) {
            return true;
        }
        if (!other || !(other instanceof BaseEntity)) {
            return false;
        }
        if (Object.getPrototypeOf(this) !== Object.getPrototypeOf(other)) {
            return false;
        }
        const otherEntity = other;
        return this._id === otherEntity._id;
    }
    /**
     * Generates hash code based on ID
     */
    hashCode() {
        if (!this._id) {
            return 0;
        }
        // Simple hash function for primitive types and strings
        const idStr = String(this._id);
        let hash = 0;
        for (let i = 0; i < idStr.length; i++) {
            const char = idStr.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash;
    }
}
exports.BaseEntity = BaseEntity;
//# sourceMappingURL=BaseEntity.js.map