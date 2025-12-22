/**
 * Base class for value object identifiers
 * @template T - The type of the identifier value
 */
export declare abstract class BaseId<T> {
    private readonly value;
    protected constructor(value: T);
    getValue(): T;
    /**
     * Checks equality based on value
     */
    equals(other: unknown): boolean;
    /**
     * Generates hash code based on value
     */
    hashCode(): number;
}
//# sourceMappingURL=BaseId.d.ts.map